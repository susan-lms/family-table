import type { PlannedDay, Recipe } from "./types";
import { repeatConflict, checkDay } from "./rules";
import { isSoft } from "./softness";
import { isMeatFree } from "./generator";
import { isMeatFreeDay, MEAT_FREE_WEEKDAYS } from "./servings";
import { recipeProtein } from "./nutrition";

export type MealChoice = { ok: true; dishes: Recipe[] } | { ok: false; message: string };
export type DinnerChoice = MealChoice;
export type DinnerMode = "quick" | "noodle" | "full";
export type LunchMode = "onedish" | "standard";

type Need = { cls: Recipe["dish_class"]; meals?: Array<NonNullable<Recipe["meal"]>> };

const withSlot = (days: PlannedDay[], date: string, slot: "lunch" | "dinner", dishes: Recipe[]): PlannedDay[] =>
  days.map((d) => (d.date === date ? { ...d, slots: { ...d.slots, [slot]: dishes } } : d));

/** Pick the best allowed dish for each need, one after the other, obeying the 14-day rule and the meat-free setting. */
function fill(
  days: PlannedDay[], date: string, slot: "lunch" | "dinner", kept: Recipe[], needs: Need[], library: Recipe[], meatFree: boolean,
): MealChoice {
  let working = withSlot(days, date, slot, kept); // the dishes being replaced are removed first
  const chosen: Recipe[] = [];
  for (const need of needs) {
    const options = library
      .filter((r) =>
        r.dish_class === need.cls &&
        (!need.meals || (r.meal && need.meals.includes(r.meal))) &&
        (!meatFree || isMeatFree(r)) &&
        !repeatConflict(working, date, r))
      .sort((a, b) =>
        Number(isSoft(b)) - Number(isSoft(a)) ||
        recipeProtein(b) - recipeProtein(a) ||
        a.estimated_cost_sgd - b.estimated_cost_sgd ||
        a.recipe_id.localeCompare(b.recipe_id));
    const best = options[0];
    if (!best) return { ok: false, message: "No suitable dish is free on this date without breaking the 14-day rule." };
    chosen.push(best);
    working = withSlot(working, date, slot, [...kept, ...chosen]);
  }
  const dishes = [...chosen, ...kept];
  const problems = checkDay(working.find((d) => d.date === date) as PlannedDay);
  if (problems.length) return { ok: false, message: problems[0].message };
  return { ok: true, dishes };
}

/**
 * Change one dinner: "quick" = one-pot rice meal + soup, "noodle" = noodle or sandwich night + soup,
 * "full" = 2 protein + 2 vegetable dishes + soup. The soup stays. `library` is the pool of normal dishes.
 */
export function suggestDinner(
  days: PlannedDay[], date: string, mode: DinnerMode, library: Recipe[], meatFreeWeekdays: number[] = MEAT_FREE_WEEKDAYS,
): MealChoice {
  const day = days.find((d) => d.date === date);
  if (!day) return { ok: false, message: "Could not find that day." };
  const soups = day.slots.dinner.filter((r) => r.dish_class === "soup");
  if (soups.length !== 1) return { ok: false, message: "This dinner has no single soup to keep." };
  const meatFree = isMeatFreeDay(date, meatFreeWeekdays);
  if (mode === "quick" && meatFree) return { ok: false, message: "This is a meat-free day. The one-pot meals all have meat or fish." };
  const needs: Need[] =
    mode === "quick" ? [{ cls: "onepot" }]
    : mode === "noodle" ? [{ cls: "onedish", meals: ["noodles", "sandwich"] }]
    : [{ cls: "protein" }, { cls: "protein" }, { cls: "vegetable" }, { cls: "vegetable" }];
  return fill(days, date, "dinner", soups, needs, library, meatFree);
}

/** Change one lunch: "onedish" = a porridge, noodle or sandwich meal; "standard" = 1 protein + 1 vegetable dish (with rice). */
export function suggestLunch(
  days: PlannedDay[], date: string, mode: LunchMode, library: Recipe[], meatFreeWeekdays: number[] = MEAT_FREE_WEEKDAYS,
): MealChoice {
  const day = days.find((d) => d.date === date);
  if (!day) return { ok: false, message: "Could not find that day." };
  const meatFree = isMeatFreeDay(date, meatFreeWeekdays);
  const needs: Need[] =
    mode === "onedish" ? [{ cls: "onedish", meals: ["porridge", "noodles", "sandwich"] }] : [{ cls: "protein" }, { cls: "vegetable" }];
  return fill(days, date, "lunch", [], needs, library, meatFree);
}
