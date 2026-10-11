import type { DishClass, PlannedDay, Recipe } from "./types";
import { dayCost } from "./rules";
import { MEAT_FREE_WEEKDAYS, QUICK_WEEKDAYS, isMeatFreeDay, isQuickNight } from "./servings";
import { mainProtein, type ProteinType } from "./protein";
import { isSoft } from "./softness";
import { recipeProtein } from "./nutrition";

export const CLASS_LABELS: Record<string, string> = {
  breakfast_item: "Breakfast items",
  snack: "Tea-break snacks",
  protein: "Meat / fish / protein dishes",
  vegetable: "Vegetable dishes",
  soup: "Soups",
  onepot: "Quick one-pot meals",
  staple: "Staples",
};

const CLASSES: DishClass[] = ["protein", "vegetable", "soup", "onepot"];

/** How many dishes of each type a normal day uses, counted over `windowDays` days (depends on how many quick nights fall in the window). */
function needInWindow(windowDays: number, quickWeekdays: number[]): Record<DishClass, number> {
  // Count quick nights in the worst window of consecutive days starting on each weekday.
  let quick = 0;
  for (let start = 0; start < 7; start++) {
    let q = 0;
    for (let k = 0; k < windowDays; k++) if (quickWeekdays.includes((start + k) % 7)) q++;
    quick = Math.max(quick, q);
  }
  const standard = windowDays - quick;
  return {
    protein: windowDays /* lunch */ + 2 * standard,
    vegetable: windowDays + 2 * standard,
    soup: windowDays,
    onepot: quick,
    breakfast_item: 0,
    snack: 0,
    staple: 0,
  };
}

export interface LibraryStatus {
  dishClass: DishClass;
  label: string;
  have: number;
  need: number;
}

/**
 * Smallest library that can fill every day when no dish may return within `windowDays`.
 * Example (Mon/Wed/Fri quick nights): 14 days need 30 protein, 30 vegetable, 14 soup and 6 one-pot dishes.
 */
export function libraryStatus(library: Recipe[], windowDays = 14, quickWeekdays = QUICK_WEEKDAYS): LibraryStatus[] {
  const need = needInWindow(windowDays, quickWeekdays);
  return CLASSES.map((c) => ({
    dishClass: c,
    label: CLASS_LABELS[c],
    have: library.filter((r) => r.dish_class === c && !r.treat).length, // treats are limited, so they do not count towards the minimum
    need: need[c],
  }));
}

/**
 * Rough idea of how long a dish stays away before it must come back:
 * dishes in the library / dishes used per day, for each type. The smallest is the bottleneck.
 */
export function estimatedGapDays(library: Recipe[], quickWeekdays = QUICK_WEEKDAYS): { days: number; limitedBy: string } {
  let best = { days: Number.POSITIVE_INFINITY, limitedBy: "" };
  const perWeek = needInWindow(7, quickWeekdays);
  for (const s of libraryStatus(library, 7, quickWeekdays)) {
    const perDay = perWeek[s.dishClass] / 7 || 1;
    const days = Math.floor(s.have / perDay);
    if (days < best.days) best = { days, limitedBy: s.label };
  }
  return best;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export interface GenOptions {
  startDate: string; // YYYY-MM-DD
  days: number;
  library: Recipe[];
  windowDays?: number; // default 14
  budget?: { min: number; max: number }; // default S$0-80 (only "over" is a warning)
  quickWeekdays?: number[]; // weekdays with a quick one-pot dinner (0 = Sunday). Default Mon, Wed, Fri.
  meatFreeWeekdays?: number[]; // weekdays with no meat, fish or seafood (eggs and tofu are fine). Default Thursday.
}

/** Dishes allowed on a meat-free day: no meat, fish or seafood in them. */
export const isMeatFree = (r: Recipe): boolean => {
  const t = mainProtein(r);
  return t === "egg & tofu" || t === "meat-free";
};

export interface GenResult {
  days: PlannedDay[];
  requested: number;
  problems: string[]; // plain-English reasons the plan stopped early
  warnings: string[]; // budget notes: never stop the plan
}

/** How strongly cheaper dishes are preferred. 0 = ignore cost. Never overrides the 14-day rule. */
const COST_WEIGHT = 4;

/** Preference for soft, easy-to-chew dishes (two seniors aged 85+): every lunch and dinner should have at least one. */
const SOFT_BONUS = 1500;

/** Preference for dishes with more protein (the seniors need enough protein). Points per gram of protein per person. */
const PROTEIN_WEIGHT = 100;

/** A treat (deep-fried) dish may appear at most once in any 7 days. */
export const TREAT_GAP_DAYS = 7;

/**
 * Build a plan. Deterministic: same input, same plan.
 * Picks dishes that have never been used or have waited longest, spreads cuisines and
 * protein types (chicken, pork, beef, fish, seafood), and never breaks the 14-day rule.
 */
export function generatePlan(opts: GenOptions): GenResult {
  const windowDays = opts.windowDays ?? 14;
  const budget = opts.budget ?? { min: 0, max: 80 };
  const quickWeekdays = opts.quickWeekdays ?? QUICK_WEEKDAYS;
  const meatFreeWeekdays = opts.meatFreeWeekdays ?? MEAT_FREE_WEEKDAYS;
  const lastUsed = new Map<string, number>();
  const cuisineTotal = new Map<string, number>();
  const typeDays = new Map<ProteinType, number[]>(); // days on which each protein type was served
  let lastTreatDay = -1000;
  const days: PlannedDay[] = [];
  const problems: string[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < opts.days; i++) {
    const date = addDays(opts.startDate, i);
    const meatFreeDay = isMeatFreeDay(date, meatFreeWeekdays);
    const quick = isQuickNight(date, quickWeekdays) && !meatFreeDay; // one-pot meals all have meat or fish, so a meat-free day gets a normal dinner
    const pickedToday = new Set<string>();
    const typesToday: ProteinType[] = [];
    let treatToday = false;
    let missing: DishClass | null = null;

    const pick = (cls: DishClass, count: number, wantSoftFirst = false): Recipe[] => {
      const chosen: Recipe[] = [];
      for (let k = 0; k < count; k++) {
        const eligible = opts.library.filter((r) => {
          if (r.dish_class !== cls || pickedToday.has(r.recipe_id)) return false;
          if (meatFreeDay && !isMeatFree(r)) return false;
          if (r.treat && (treatToday || i - lastTreatDay < TREAT_GAP_DAYS)) return false;
          const last = lastUsed.get(r.recipe_id);
          return last === undefined || i - last >= windowDays;
        });
        if (eligible.length === 0) {
          missing = cls;
          return chosen;
        }
        const score = (r: Recipe) => {
          const last = lastUsed.get(r.recipe_id);
          const gap = last === undefined ? 1000 : i - last; // never used / longest ago first
          const sameCuisineNow = chosen.filter((c) => c.cuisine === r.cuisine).length;
          let s = (wantSoftFirst && k === 0 && isSoft(r) ? -SOFT_BONUS : 0) + sameCuisineNow * 1000 + (cuisineTotal.get(r.cuisine) ?? 0) * 10 - gap + (hash(r.recipe_id + i) % 7) + r.estimated_cost_sgd * COST_WEIGHT;
          if (meatFreeWeekdays.length && !meatFreeDay && cls === "protein" && mainProtein(r) === "egg & tofu") s += 120; // keep egg and tofu mains available for meat-free days
          if (cls === "protein" || cls === "onepot") s -= (recipeProtein(r) / 8) * PROTEIN_WEIGHT;
          if (cls === "protein" || cls === "onepot") {
            // spread chicken / pork / beef / fish / seafood: avoid a type already served today, prefer types not seen lately
            const t = mainProtein(r);
            s += typesToday.filter((x) => x === t).length * 400;
            const recent = (typeDays.get(t) ?? []).filter((d) => i - d < 7).length;
            s += recent * 60;
          }
          return s;
        };
        eligible.sort((a, b) => score(a) - score(b) || a.recipe_id.localeCompare(b.recipe_id));
        const best = eligible[0];
        chosen.push(best);
        pickedToday.add(best.recipe_id);
        if (best.treat) treatToday = true;
        if (cls === "protein" || cls === "onepot") typesToday.push(mainProtein(best));
      }
      return chosen;
    };

    const lunchProtein = pick("protein", 1, true);
    const lunchVeg = pick("vegetable", 1, true);
    let dinner: Recipe[];
    if (quick) {
      dinner = [...pick("onepot", 1, true), ...pick("soup", 1)];
    } else {
      dinner = [...pick("protein", 2, true), ...pick("vegetable", 2, true), ...pick("soup", 1)];
    }

    if (missing) {
      problems.push(
        `Stopped at ${date} (day ${i + 1}): not enough ${CLASS_LABELS[missing].toLowerCase()} that are allowed on that day. Add more dishes of this type.`,
      );
      break;
    }

    const day: PlannedDay = { date, slots: { lunch: [...lunchProtein, ...lunchVeg], dinner } };
    for (const r of Object.values(day.slots).flat()) {
      lastUsed.set(r.recipe_id, i);
      cuisineTotal.set(r.cuisine, (cuisineTotal.get(r.cuisine) ?? 0) + 1);
    }
    for (const t of typesToday) typeDays.set(t, [...(typeDays.get(t) ?? []), i]);
    if (treatToday) lastTreatDay = i;
    const cost = dayCost(day);
    if (cost > budget.max) warnings.push(`${date}: estimated S$${cost.toFixed(2)} is over the S$${budget.max} target.`);
    else if (cost < budget.min) warnings.push(`${date}: estimated S$${cost.toFixed(2)} is under the S$${budget.min} target.`);
    days.push(day);
  }

  return { days, requested: opts.days, problems, warnings };
}
