import type { Cuisine, DishClass, PlannedDay, Recipe } from "./types";

/**
 * SAMPLE DATA ONLY. Written for this prototype, not yet taste-tested.
 * Costs are placeholder numbers, NOT real Singapore prices.
 */
const base = (
  id: string, name: string, cuisine: Cuisine, dish_class: DishClass,
  prep: number, cook: number, cost: number, extra: Partial<Recipe> = {},
): Recipe => ({
  recipe_id: id, name, cuisine, dish_class, servings_default: 8,
  prep_time_minutes: prep, cook_time_minutes: cook, estimated_cost_sgd: cost,
  is_sample: true, ...extra,
});

export const gingerChicken: Recipe = base("R-CN-001", "Ginger-steamed chicken", "Chinese", "protein", 20, 25, 7.5, {
  equipment: ["Steamer or wok with lid", "Heat-proof plate"],
  ingredients: [
    { name: "Chicken thigh, bone-in", qty: 1.2, unit: "kg", prep: "cut into bite-size pieces", category: "Meat" },
    { name: "Ginger", qty: 60, unit: "g", prep: "sliced thinly", category: "Vegetables" },
    { name: "Spring onion", qty: 4, unit: "piece", prep: "cut into 4 cm lengths", category: "Vegetables" },
    { name: "Reduced-sodium light soy sauce", qty: 2, unit: "tbsp", category: "Pantry" },
    { name: "Shaoxing wine", qty: 2, unit: "tbsp", category: "Pantry" },
    { name: "Sesame oil", qty: 2, unit: "tsp", category: "Pantry" },
    { name: "White pepper", qty: 0.5, unit: "tsp", category: "Pantry" },
  ],
  steps: [
    "Wash your hands. Rinse the chicken and pat it dry with paper towel.",
    "Put the chicken in a bowl. Add the ginger, soy sauce, wine, sesame oil and pepper. Mix well.",
    "Leave it to rest for 15 minutes.",
    "Boil water in the steamer on high heat.",
    "Put the chicken on a heat-proof plate. Place it in the steamer. Cover with the lid.",
    "Turn to medium heat. Steam for 25 minutes.",
    "Check: cut the thickest piece open. The juice must run clear and there must be no pink.",
    "Scatter the spring onion on top. Steam 1 more minute. Serve hot.",
  ],
  oil_salt_sugar_note: "No added salt or sugar. Only 2 tbsp reduced-sodium soy sauce and 2 tsp sesame oil for 8 people.",
  food_safety: "Chicken must be cooked all the way through. No pink, juice runs clear. Keep raw chicken away from other food.",
});

export const garlicBroccoli: Recipe = base("R-CN-002", "Garlic broccoli", "Chinese", "vegetable", 10, 6, 3.5, {
  equipment: ["Wok or large pan", "Pot"],
  ingredients: [
    { name: "Broccoli", qty: 800, unit: "g", prep: "cut into small florets", category: "Vegetables" },
    { name: "Garlic", qty: 6, unit: "piece", prep: "cloves, chopped finely", category: "Vegetables" },
    { name: "Cooking oil", qty: 1, unit: "tbsp", category: "Pantry" },
    { name: "Reduced-sodium light soy sauce", qty: 1, unit: "tsp", category: "Pantry" },
  ],
  steps: [
    "Wash the broccoli. Cut into small florets.",
    "Boil a pot of water. Add the broccoli. Cook 2 minutes. Drain well.",
    "Heat the wok on medium heat. Add 1 tbsp oil (measure it with a spoon).",
    "Add the garlic. Stir 20 seconds until you can smell it. Do not let it turn brown.",
    "Add the broccoli. Stir 1 minute on medium-high heat.",
    "Add the soy sauce. Stir once. Serve.",
  ],
  oil_salt_sugar_note: "Only 1 tbsp oil for 8 people. No added salt or sugar.",
});

export const gingerFish: Recipe = base("R-CN-003", "Ginger-steamed fish", "Chinese", "protein", 15, 12, 10, {
  equipment: ["Steamer or wok with lid", "Heat-proof plate"],
  ingredients: [
    { name: "Sea bass, whole, cleaned", qty: 1, unit: "kg", category: "Seafood" },
    { name: "Ginger", qty: 40, unit: "g", prep: "cut into thin strips", category: "Vegetables" },
    { name: "Spring onion", qty: 3, unit: "piece", prep: "cut into thin strips", category: "Vegetables" },
    { name: "Reduced-sodium light soy sauce", qty: 1, unit: "tbsp", category: "Pantry" },
    { name: "Cooking oil", qty: 1, unit: "tbsp", category: "Pantry" },
  ],
  steps: [
    "Rinse the fish inside and out. Pat dry. Make 2 cuts on each side of the fish.",
    "Put half the ginger on a heat-proof plate. Lay the fish on top. Put the rest of the ginger on the fish.",
    "Boil water in the steamer on high heat.",
    "Place the plate in the steamer. Cover. Steam on high heat for 10 to 12 minutes.",
    "Check: push a fork into the thickest part. The flesh must flake easily and look white all the way through.",
    "Pour away the water on the plate. Put the spring onion on the fish.",
    "Heat 1 tbsp oil in a small pot until hot. Pour it over the spring onion. Add the soy sauce. Serve.",
  ],
  oil_salt_sugar_note: "Only 1 tbsp oil and 1 tbsp reduced-sodium soy sauce for the whole fish.",
  food_safety: "Fish must be cooked through. Eat it the same day or chill it within 1 hour.",
});

export const winterMelonSoup: Recipe = base("R-CN-004", "Winter melon soup", "Chinese", "soup", 15, 70, 6, {
  equipment: ["Large pot with lid"],
  ingredients: [
    { name: "Winter melon", qty: 1, unit: "kg", prep: "skin and seeds removed, cut into 3 cm pieces", category: "Vegetables" },
    { name: "Pork ribs", qty: 400, unit: "g", prep: "cut into small pieces", category: "Meat" },
    { name: "Ginger", qty: 30, unit: "g", prep: "sliced", category: "Vegetables" },
    { name: "Water", qty: 2.5, unit: "l", category: "Pantry" },
  ],
  steps: [
    "Boil a small pot of water. Add the pork ribs. Cook 3 minutes. Drain and rinse the ribs.",
    "Put 2.5 litres of water in the large pot. Add the ribs and ginger. Bring to the boil.",
    "Turn to low heat. Cover. Simmer for 40 minutes.",
    "Add the winter melon. Simmer 25 more minutes until the melon is soft and see-through.",
    "Taste. Add salt only if needed, a small pinch at a time. Serve hot.",
  ],
  oil_salt_sugar_note: "No stock cube. The flavour comes from the ribs and ginger. Salt is optional.",
});

const day1: PlannedDay = {
  date: "2026-10-12",
  slots: {
    breakfast: [
      base("R-CN-010", "Steamed chicken buns", "Chinese", "breakfast_item", 30, 20, 4),
      base("R-WE-010", "Hard-boiled eggs", "Western", "breakfast_item", 2, 12, 2.5),
    ],
    morning_tea: [base("R-WE-011", "Banana-oat mini muffins", "Western", "snack", 15, 20, 3)],
    lunch: [gingerChicken, garlicBroccoli],
    afternoon_tea: [
      base("R-FU-010", "Steamed sweet potato pieces", "Fusion", "snack", 5, 20, 2),
      base("R-WE-012", "Small steamed corn portions", "Western", "snack", 3, 15, 2),
    ],
    dinner: [
      base("R-CN-011", "Soy-braised chicken (reduced sodium)", "Chinese", "protein", 15, 35, 6.5),
      gingerFish,
      base("R-CN-012", "Lightly stir-fried bok choy", "Chinese", "vegetable", 8, 5, 3),
      base("R-CN-013", "Carrot and mushroom stir-fry", "Chinese", "vegetable", 10, 8, 3.5),
      winterMelonSoup,
    ],
  },
};

const day2: PlannedDay = {
  date: "2026-10-13",
  slots: {
    breakfast: [
      base("R-JP-010", "Rice porridge with silken tofu", "Japanese", "breakfast_item", 5, 30, 3),
      base("R-JP-011", "Tamagoyaki (rolled omelette, no sugar)", "Japanese", "breakfast_item", 10, 10, 3),
    ],
    morning_tea: [base("R-KR-010", "Steamed pumpkin cubes", "Korean", "snack", 8, 15, 2)],
    lunch: [
      base("R-ES-010", "Baked chicken with paprika and garlic", "Spanish", "protein", 15, 45, 8),
      base("R-ES-011", "Roasted peppers and courgette", "Spanish", "vegetable", 10, 30, 4),
    ],
    afternoon_tea: [base("R-WE-013", "Wholemeal mini sandwiches with egg", "Western", "snack", 15, 0, 3.5)],
    dinner: [
      base("R-KR-011", "Beef and radish stew", "Korean", "protein", 15, 60, 11),
      base("R-FU-011", "Steamed tofu with mushroom topping", "Fusion", "protein", 10, 15, 5),
      base("R-KR-012", "Seasoned spinach (namul)", "Korean", "vegetable", 10, 4, 3),
      base("R-JP-012", "Simmered pumpkin and green beans", "Japanese", "vegetable", 10, 15, 3.5),
      base("R-JP-013", "Miso soup with tofu (low-salt)", "Japanese", "soup", 8, 10, 3),
    ],
  },
};

export const sampleDays: PlannedDay[] = [day1, day2];

export const SLOT_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  morning_tea: "Morning tea break",
  lunch: "Lunch",
  afternoon_tea: "Afternoon tea break",
  dinner: "Dinner",
};

export const SLOT_ORDER = ["breakfast", "morning_tea", "lunch", "afternoon_tea", "dinner"] as const;

export function findRecipe(id: string): Recipe | undefined {
  return sampleDays
    .flatMap((d) => SLOT_ORDER.flatMap((s) => d.slots[s]))
    .find((r) => r.recipe_id === id);
}
