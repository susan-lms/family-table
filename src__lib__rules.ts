import type { PlannedDay, Problem, Recipe, Slot } from "./types";
import { slotFactor } from "./servings";

const SLOT_NAMES: Slot[] = ["lunch", "dinner"];

const count = (items: Recipe[], cls: Recipe["dish_class"]) =>
  items.filter((r) => r.dish_class === cls).length;

/**
 * Check one day against the meal rules.
 * Lunch (4 people): 1 protein + 1 vegetable, OR 1 one-dish meal (porridge, noodles or sandwich).
 * Dinner (8 people): a soup every day, plus EITHER 2 protein + 2 vegetable dishes
 * OR 1 quick one-pot meal (rice with meat/fish and vegetables) OR 1 one-dish meal (noodles or sandwich).
 */
export function checkDay(day: PlannedDay): Problem[] {
  const out: Problem[] = [];
  const add = (rule: string, message: string) => out.push({ date: day.date, rule, message });

  const l = day.slots.lunch ?? [];
  const lunchStandard = l.length === 2 && count(l, "protein") === 1 && count(l, "vegetable") === 1;
  const lunchOneDish = l.length === 1 && count(l, "onedish") === 1;
  if (!lunchStandard && !lunchOneDish)
    add("lunch", "Lunch needs 1 protein dish + 1 vegetable dish, or 1 one-dish meal (porridge, noodles or sandwich).");

  const d = (day.slots.dinner ?? []).filter((r) => r.dish_class !== "staple");
  if (count(d, "soup") !== 1) add("dinner-soup", "Dinner needs a soup.");
  const standard = d.length === 5 && count(d, "protein") === 2 && count(d, "vegetable") === 2 && count(d, "soup") === 1;
  const quick = d.length === 2 && (count(d, "onepot") === 1 || count(d, "onedish") === 1) && count(d, "soup") === 1;
  if (!standard && !quick)
    add("dinner", "Dinner needs a soup plus either 2 protein + 2 vegetable dishes, 1 quick one-pot meal, or 1 one-dish meal (noodles or sandwich).");

  return out;
}

const dayNumber = (iso: string) => Math.round(Date.parse(iso + "T00:00:00Z") / 86_400_000);

/** No recipe_id may appear twice within any rolling 14-day window (i.e. gap of 13 days or less). */
export function checkNoRepeat(days: PlannedDay[], windowDays = 14): Problem[] {
  const out: Problem[] = [];
  const last = new Map<string, { date: string; n: number }>();
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  for (const day of sorted) {
    const n = dayNumber(day.date);
    const seenToday = new Set<string>();
    for (const s of SLOT_NAMES) {
      for (const r of day.slots[s] ?? []) {
        if (seenToday.has(r.recipe_id)) {
          out.push({ date: day.date, rule: "14-day", message: `${r.name} is used twice on the same day.` });
          continue;
        }
        seenToday.add(r.recipe_id);
        const prev = last.get(r.recipe_id);
        if (prev && n - prev.n < windowDays)
          out.push({
            date: day.date,
            rule: "14-day",
            message: `${r.name} was already used on ${prev.date}. It can return on or after day ${windowDays} later.`,
          });
      }
    }
    for (const id of seenToday) last.set(id, { date: day.date, n });
  }
  return out;
}

/** Run every hard rule. Plan may only be saved when this returns an empty list. */
/**
 * Can this recipe go on this date? Looks 13 days back and 13 days ahead.
 * Returns a plain-English reason if not, or null if it is allowed.
 */
export function repeatConflict(
  days: PlannedDay[], date: string, recipe: Recipe, windowDays = 14,
): string | null {
  const n = dayNumber(date);
  for (const d of days) {
    const gap = Math.abs(dayNumber(d.date) - n);
    if (gap >= windowDays) continue;
    const used = SLOT_NAMES.some((s) => (d.slots[s] ?? []).some((r) => r.recipe_id === recipe.recipe_id));
    if (used) return gap === 0 ? "Already on the menu today" : `Used on ${d.date} (too soon, 14-day rule)`;
  }
  if (recipe.treat) {
    for (const d of days) {
      if (Math.abs(dayNumber(d.date) - n) >= TREAT_WINDOW) continue;
      if (SLOT_NAMES.some((s) => (d.slots[s] ?? []).some((r) => r.treat)))
        return `Another treat (deep-fried) dish is on ${d.date}. Only 1 treat in any 7 days.`;
    }
  }
  return null;
}

const TREAT_WINDOW = 7;

/** At most 1 treat (deep-fried) dish in any 7 days. */
export function checkTreats(days: PlannedDay[]): Problem[] {
  const out: Problem[] = [];
  const treatDays = days
    .map((d) => ({ date: d.date, n: dayNumber(d.date), count: SLOT_NAMES.flatMap((s) => d.slots[s] ?? []).filter((r) => r.treat).length }))
    .filter((d) => d.count > 0);
  for (let k = 0; k < treatDays.length; k++) {
    if (treatDays[k].count > 1)
      out.push({ date: treatDays[k].date, rule: "treat", message: `More than one treat dish on ${treatDays[k].date}.` });
    if (k > 0 && treatDays[k].n - treatDays[k - 1].n < TREAT_WINDOW)
      out.push({ date: treatDays[k].date, rule: "treat", message: `Treat dishes on ${treatDays[k - 1].date} and ${treatDays[k].date} are too close. Only 1 treat in any 7 days.` });
  }
  return out;
}

export function validatePlan(days: PlannedDay[]): Problem[] {
  return [...days.flatMap(checkDay), ...checkNoRepeat(days), ...checkTreats(days)];
}

/** Cost of one meal for the number of people it is cooked for. */
export const slotCost = (day: PlannedDay, slot: Slot) =>
  (day.slots[slot] ?? []).reduce((sum, r) => sum + r.estimated_cost_sgd, 0) * slotFactor(slot);

/** Daily cost estimate (rough estimates from prices.ts). */
export const dayCost = (day: PlannedDay) =>
  SLOT_NAMES.reduce(
    (total, slot) => total + (day.slots[slot] ?? []).reduce((sum, r) => sum + r.estimated_cost_sgd, 0) * slotFactor(slot),
    0,
  );

export function budgetWarning(day: PlannedDay, min = 0, max = 80): string | null {
  const c = dayCost(day);
  if (c > max) return `Estimated S$${c.toFixed(2)} is over the S$${max} target.`;
  if (c < min) return `Estimated S$${c.toFixed(2)} is under the S$${min} target — check nothing is missing.`;
  return null;
}
