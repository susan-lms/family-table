import type { PlannedDay, Problem, Recipe, Slot } from "./types";

const SLOT_NAMES: Slot[] = ["breakfast", "morning_tea", "lunch", "afternoon_tea", "dinner"];

const count = (items: Recipe[], cls: Recipe["dish_class"]) =>
  items.filter((r) => r.dish_class === cls).length;

/** Check one day against the meal composition rules. */
export function checkDay(day: PlannedDay): Problem[] {
  const out: Problem[] = [];
  const add = (rule: string, message: string) => out.push({ date: day.date, rule, message });

  for (const s of SLOT_NAMES) {
    if (!day.slots[s] || day.slots[s].length === 0) add("five-meals", `${s} is empty.`);
  }

  const b = day.slots.breakfast ?? [];
  if (b.length !== 2) add("breakfast", `Breakfast needs exactly 2 food items (has ${b.length}).`);

  for (const s of ["morning_tea", "afternoon_tea"] as Slot[]) {
    const items = day.slots[s] ?? [];
    if (items.length < 1 || items.length > 2) add("tea-break", `${s} needs 1–2 snack items (has ${items.length}).`);
    if (items.some((r) => r.dish_class !== "snack")) add("tea-break", `${s} must be finger-food snacks only.`);
  }

  const l = day.slots.lunch ?? [];
  if (l.length !== 2 || count(l, "protein") !== 1 || count(l, "vegetable") !== 1)
    add("lunch", "Lunch needs exactly 1 protein dish and 1 vegetable dish.");

  const d = (day.slots.dinner ?? []).filter((r) => r.dish_class !== "staple");
  if (d.length !== 5 || count(d, "protein") !== 2 || count(d, "vegetable") !== 2 || count(d, "soup") !== 1)
    add("dinner", "Dinner needs 2 protein dishes, 2 vegetable dishes and 1 soup.");

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
  return null;
}

export function validatePlan(days: PlannedDay[]): Problem[] {
  return [...days.flatMap(checkDay), ...checkNoRepeat(days)];
}

/** Daily cost estimate (rough estimates from prices.ts). */
export const dayCost = (day: PlannedDay) =>
  SLOT_NAMES.flatMap((s) => day.slots[s] ?? []).reduce((sum, r) => sum + r.estimated_cost_sgd, 0);

export function budgetWarning(day: PlannedDay, min = 60, max = 70): string | null {
  const c = dayCost(day);
  if (c > max) return `Estimated S$${c.toFixed(2)} is over the S$${max} target.`;
  if (c < min) return `Estimated S$${c.toFixed(2)} is under the S$${min} target — check nothing is missing.`;
  return null;
}
