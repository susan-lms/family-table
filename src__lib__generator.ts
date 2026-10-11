import type { DishClass, PlannedDay, Recipe } from "./types";
import { dayCost } from "./rules";

/** How many dishes of each type one day uses (tea breaks: 1 snack each). */
const PER_DAY: Record<DishClass, number> = {
  breakfast_item: 2,
  snack: 2,
  protein: 3, // 1 at lunch + 2 at dinner
  vegetable: 3, // 1 at lunch + 2 at dinner
  soup: 1,
  staple: 0,
};

export const CLASS_LABELS: Record<string, string> = {
  breakfast_item: "Breakfast items",
  snack: "Tea-break snacks",
  protein: "Meat / protein dishes",
  vegetable: "Vegetable dishes",
  soup: "Soups",
  staple: "Staples",
};

export interface LibraryStatus {
  dishClass: DishClass;
  label: string;
  have: number;
  need: number;
}

/**
 * Smallest library that can fill every day when no dish may return within `windowDays`.
 * Example: 3 protein dishes a day x 14 days = 42 different protein dishes.
 */
export function libraryStatus(library: Recipe[], windowDays = 14): LibraryStatus[] {
  const classes: DishClass[] = ["breakfast_item", "snack", "protein", "vegetable", "soup"];
  return classes.map((c) => ({
    dishClass: c,
    label: CLASS_LABELS[c],
    have: library.filter((r) => r.dish_class === c).length,
    need: PER_DAY[c] * windowDays,
  }));
}

/**
 * Rough idea of how long a dish stays away before it must come back.
 * Each type of dish has its own limit: dishes in the library / dishes used per day.
 * The smallest one is the bottleneck.
 */
export function estimatedGapDays(library: Recipe[]): { days: number; limitedBy: string } {
  let best = { days: Number.POSITIVE_INFINITY, limitedBy: "" };
  for (const s of libraryStatus(library, 1)) {
    const days = Math.floor(s.have / (s.need || 1));
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
  budget?: { min: number; max: number }; // default S$60-70
}

export interface GenResult {
  days: PlannedDay[];
  requested: number;
  /** Plain-English reasons the plan stopped early. Empty when every day was built. */
  problems: string[];
  /** Budget notes. These are warnings, not rule breaks. */
  warnings: string[];
}

/**
 * Builds days one by one. A dish is only chosen if it has not been used in the last
 * (windowDays - 1) days. If no valid dish exists, it stops and says why. It never breaks a rule.
 */
/** How strongly cheaper dishes are preferred. 0 = ignore cost. Never overrides the 14-day rule. */
const COST_WEIGHT = 8;

export function generatePlan(opts: GenOptions): GenResult {
  const windowDays = opts.windowDays ?? 14;
  const budget = opts.budget ?? { min: 60, max: 70 };
  const lastUsed = new Map<string, number>();
  const cuisineTotal = new Map<string, number>();
  const days: PlannedDay[] = [];
  const problems: string[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < opts.days; i++) {
    const date = addDays(opts.startDate, i);
    const pickedToday = new Set<string>();
    let missing: DishClass | null = null;

    const pick = (cls: DishClass, count: number): Recipe[] => {
      const chosen: Recipe[] = [];
      for (let k = 0; k < count; k++) {
        const eligible = opts.library.filter((r) => {
          if (r.dish_class !== cls || pickedToday.has(r.recipe_id)) return false;
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
          return sameCuisineNow * 1000 + (cuisineTotal.get(r.cuisine) ?? 0) * 10 - gap + (hash(r.recipe_id + i) % 7) + r.estimated_cost_sgd * COST_WEIGHT;
        };
        eligible.sort((a, b) => score(a) - score(b) || a.recipe_id.localeCompare(b.recipe_id));
        chosen.push(eligible[0]);
        pickedToday.add(eligible[0].recipe_id);
      }
      return chosen;
    };

    const breakfast = pick("breakfast_item", 2);
    const morningTea = pick("snack", 1);
    const lunchProtein = pick("protein", 1);
    const lunchVeg = pick("vegetable", 1);
    const afternoonTea = pick("snack", 1);
    const dinnerProtein = pick("protein", 2);
    const dinnerVeg = pick("vegetable", 2);
    const soup = pick("soup", 1);

    if (missing) {
      problems.push(
        `Stopped at ${date} (day ${i + 1}): not enough ${CLASS_LABELS[missing].toLowerCase()} that are allowed on that day. Add more dishes of this type.`,
      );
      break;
    }

    const day: PlannedDay = {
      date,
      slots: {
        breakfast,
        morning_tea: morningTea,
        lunch: [...lunchProtein, ...lunchVeg],
        afternoon_tea: afternoonTea,
        dinner: [...dinnerProtein, ...dinnerVeg, ...soup],
      },
    };
    for (const r of Object.values(day.slots).flat()) {
      lastUsed.set(r.recipe_id, i);
      cuisineTotal.set(r.cuisine, (cuisineTotal.get(r.cuisine) ?? 0) + 1);
    }
    const cost = dayCost(day);
    if (cost > budget.max) warnings.push(`${date}: estimated S$${cost.toFixed(2)} is over the S$${budget.max} target.`);
    else if (cost < budget.min) warnings.push(`${date}: estimated S$${cost.toFixed(2)} is under the S$${budget.min} target.`);
    days.push(day);
  }

  return { days, requested: opts.days, problems, warnings };
}
