export type Cuisine = "Chinese" | "Western" | "Japanese" | "Korean" | "Fusion" | "Spanish";

export type DishClass =
  | "protein"
  | "vegetable"
  | "soup"
  | "snack"
  | "breakfast_item"
  | "staple";

export type Slot = "breakfast" | "morning_tea" | "lunch" | "afternoon_tea" | "dinner";

export type Category =
  | "Vegetables" | "Fruit" | "Meat" | "Seafood" | "Eggs & dairy" | "Pantry" | "Other";

export interface Ingredient {
  name: string;
  qty: number;
  unit: "g" | "kg" | "ml" | "l" | "tsp" | "tbsp" | "piece";
  prep?: string; // e.g. "sliced thinly"
  category: Category;
}

export interface Recipe {
  recipe_id: string; // stable, never reused
  name: string;
  cuisine: Cuisine;
  dish_class: DishClass;
  servings_default: 8;
  prep_time_minutes: number;
  cook_time_minutes: number;
  estimated_cost_sgd: number; // placeholder estimate, not a real price
  is_sample: boolean; // true until a person has checked it
  ingredients?: Ingredient[]; // missing = "recipe details coming"
  steps?: string[];
  equipment?: string[];
  oil_salt_sugar_note?: string;
  food_safety?: string;
}

export interface PlannedDay {
  date: string; // YYYY-MM-DD
  slots: Record<Slot, Recipe[]>;
}

export interface Problem {
  date: string;
  rule: string;
  message: string;
}
