import type { Category, Cuisine, DishClass, Ingredient, Recipe } from "./types";

/** Small helpers so each recipe stays short and easy to review. */
type U = Ingredient["unit"];

export const i = (name: string, qty: number, unit: U, category: Category, prep?: string): Ingredient =>
  prep ? { name, qty, unit, category, prep } : { name, qty, unit, category };

export interface Spec {
  id: string; name: string; cuisine: Cuisine; cls: DishClass;
  prep: number; cook: number; cost: number;
  equipment: string[]; ingredients: Ingredient[]; steps: string[];
  note: string; safety?: string; allergens?: string[];
}

/** Builds a recipe for 8 people. is_sample stays true until a person has taste-tested it. */
export const R = (s: Spec): Recipe => ({
  recipe_id: s.id, name: s.name, cuisine: s.cuisine, dish_class: s.cls, servings_default: 8,
  prep_time_minutes: s.prep, cook_time_minutes: s.cook, estimated_cost_sgd: s.cost, is_sample: true,
  equipment: s.equipment, ingredients: s.ingredients, steps: s.steps,
  oil_salt_sugar_note: s.note, food_safety: s.safety, allergens: s.allergens,
});

export const POULTRY = "Chicken must be cooked all the way through. No pink, juice runs clear. Keep raw chicken away from other food. Wash hands and board after touching it.";
export const FISH = "Fish must be cooked through and flake easily. Eat it the same day or chill within 1 hour.";
export const PORK = "Pork must be cooked all the way through. No pink, juice runs clear. Keep raw pork away from other food.";
export const BEEF = "Cook beef until it is very tender and cooked through. Keep raw beef away from other food.";
export const EGGS = "Cook eggs until fully set. Wash hands and utensils after touching raw egg.";
export const SHELLFISH = "Prawns must be pink and cooked through. Eat the same day or chill within 1 hour.";
export const RAW = "This dish has raw vegetables. Wash everything well. Keep it chilled and eat the same day.";

/** Short form of R(): positional arguments keep big batches readable. */
export const T = (
  id: string, name: string, cuisine: Cuisine, cls: DishClass, prep: number, cook: number, cost: number,
  equipment: string[], ingredients: Ingredient[], steps: string[], note: string, safety?: string, allergens?: string[],
): Recipe => R({ id, name, cuisine, cls, prep, cook, cost, equipment, ingredients, steps, note, safety, allergens });

/** Recipe-book only dishes: never used by the meal planner. All are meant to take 30 minutes or less. */
export const BR = (r: Recipe, extra: Partial<Recipe> = {}): Recipe => ({ ...r, browse: true, ...extra });
export const RG = (region: NonNullable<Recipe["region"]>, r: Recipe, extra: Partial<Recipe> = {}): Recipe => BR(r, { region, ...extra });
