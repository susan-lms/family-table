import type { PlannedDay, Recipe } from "./types";
import { repeatConflict, checkDay } from "./rules";
import { isSoft } from "./softness";
import { isMeatFree } from "./generator";
import { isMeatFreeDay, MEAT_FREE_WEEKDAYS } from "./servings";
import { recipeProtein } from "./nutrition";

export type DinnerChoice = { ok: true; dishes: Recipe[] } | { ok: false; message: string };

const withDinner = (days: PlannedDay[], date: string, dinner: Recipe[]): PlannedDay[] =>
  days.map((d) => (d.date === date ? { ...d, slots: { ...d.slots, dinner } } : d));

/**
 * Turn one dinner into a quick one-pot night ("quick") or back into a full dinner of 2 meat/protein + 2 vegetable dishes ("full").
 * The soup stays. The new dishes obey the 14-day rule, the treat rule and the meal rules.
 * `library` is the pool of normal dishes.
 */
export function suggestDinner(
  days: PlannedDay[], date: string, mode: "quick" | "full", library: Recipe[], meatFreeWeekdays: number[] = MEAT_FREE_WEEKDAYS,
): DinnerChoice {
  const day = days.find((d) => d.date === date);
  if (!day) return { ok: false, message: "Could not find that day." };
  const soups = day.slots.dinner.filter((r) => r.dish_class === "soup");
  if (soups.length !== 1) return { ok: false, message: "This dinner has no single soup to keep." };
  const meatFree = isMeatFreeDay(date, meatFreeWeekdays);
  if (mode === "quick" && meatFree) return { ok: false, message: "This is a meat-free day. The one-pot meals all have meat or fish." };

  let working = withDinner(days, date, soups); // the dishes being replaced are removed first
  const chosen: Recipe[] = [];
  const need: Array<"protein" | "vegetable" | "onepot"> = mode === "quick" ? ["onepot"] : ["protein", "protein", "vegetable", "vegetable"];

  for (const cls of need) {
    const options = library
      .filter((r) => r.dish_class === cls && (!meatFree || isMeatFree(r)) && !repeatConflict(working, date, r))
      .sort((a, b) =>
        Number(isSoft(b)) - Number(isSoft(a)) ||
        recipeProtein(b) - recipeProtein(a) ||
        a.estimated_cost_sgd - b.estimated_cost_sgd ||
        a.recipe_id.localeCompare(b.recipe_id));
    const best = options[0];
    if (!best) return { ok: false, message: "No suitable dish is free on this date without breaking the 14-day rule." };
    chosen.push(best);
    working = withDinner(working, date, [...soups, ...chosen]);
  }
  const dishes = [...chosen, ...soups];
  const problems = checkDay(working.find((d) => d.date === date) as PlannedDay);
  if (problems.length) return { ok: false, message: problems[0].message };
  return { ok: true, dishes };
}
