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

/** Extra dishes you can swap in. SAMPLE DATA: only roast chicken has full steps so far. */
export const roastChicken: Recipe = base("R-WE-001", "Roast chicken with garlic and lemon", "Western", "protein", 15, 45, 9, {
  equipment: ["Oven (or a heavy covered pan on the stove)", "Baking tray"],
  ingredients: [
    { name: "Chicken thigh, bone-in", qty: 1.5, unit: "kg", category: "Meat" },
    { name: "Garlic", qty: 8, unit: "piece", prep: "cloves, crushed", category: "Vegetables" },
    { name: "Lemon", qty: 2, unit: "piece", prep: "1 juiced, 1 cut into wedges", category: "Fruit" },
    { name: "Olive oil", qty: 2, unit: "tbsp", category: "Pantry" },
    { name: "Paprika", qty: 2, unit: "tsp", category: "Pantry" },
    { name: "Dried thyme", qty: 1, unit: "tsp", category: "Pantry" },
    { name: "Black pepper", qty: 1, unit: "tsp", category: "Pantry" },
    { name: "Salt", qty: 1, unit: "tsp", category: "Pantry" },
  ],
  steps: [
    "Wash your hands. Heat the oven to 200°C.",
    "Rinse the chicken and pat it very dry with paper towel.",
    "In a large bowl, mix the lemon juice, olive oil, garlic, paprika, thyme, pepper and salt.",
    "Add the chicken. Rub the mixture all over the pieces.",
    "Place the chicken on a baking tray, skin side up. Add the lemon wedges around it.",
    "Roast for 40 to 45 minutes. Turn the tray once halfway.",
    "Check: cut the thickest piece open. The juice must run clear and there must be no pink.",
    "Rest 5 minutes. Spoon the juices over the chicken. Serve hot.",
  ],
  oil_salt_sugar_note: "Only 2 tbsp oil and 1 tsp salt for 1.5 kg of chicken (8 people). Flavour comes from garlic, lemon and herbs. No sugar.",
  food_safety: "Chicken must be cooked all the way through. No pink, juice runs clear. Keep raw chicken away from other food.",
});

export const alternatives: Recipe[] = [
  roastChicken,
  // Protein dishes
  base("R-WE-002", "Baked salmon with lemon and herbs", "Western", "protein", 10, 20, 14),
  base("R-JP-001", "Teriyaki-style chicken (low sugar)", "Japanese", "protein", 10, 25, 8),
  base("R-KR-001", "Beef bulgogi-style (low sugar)", "Korean", "protein", 15, 10, 12),
  base("R-ES-001", "Garlic prawns", "Spanish", "protein", 10, 8, 13),
  base("R-FU-001", "Steamed egg with minced chicken", "Fusion", "protein", 10, 15, 5),
  base("R-CN-020", "Braised tofu with mushrooms", "Chinese", "protein", 10, 20, 4.5),
  // Vegetable dishes
  base("R-CN-021", "Stir-fried kailan with ginger", "Chinese", "vegetable", 8, 6, 3.5),
  base("R-WE-003", "Roasted mixed vegetables", "Western", "vegetable", 15, 30, 4.5),
  base("R-KR-002", "Cucumber salad (no sugar)", "Korean", "vegetable", 10, 0, 3),
  base("R-JP-002", "Steamed cabbage with sesame", "Japanese", "vegetable", 8, 8, 3),
  base("R-ES-002", "Sautéed spinach with garlic", "Spanish", "vegetable", 8, 5, 3.5),
  base("R-FU-002", "Steamed pumpkin and okra", "Fusion", "vegetable", 10, 15, 4),
  // Soups
  base("R-CN-022", "Tomato and egg soup", "Chinese", "soup", 10, 20, 3.5),
  base("R-WE-004", "Chicken and sweetcorn soup", "Western", "soup", 10, 40, 5),
  base("R-ES-003", "White bean and vegetable soup", "Spanish", "soup", 15, 45, 4.5),
  base("R-JP-003", "Clear mushroom soup", "Japanese", "soup", 8, 15, 3.5),
  // Tea-break snacks
  base("R-FU-003", "Papaya cubes", "Fusion", "snack", 5, 0, 3),
  base("R-WE-005", "Baked sweet potato wedges", "Western", "snack", 5, 30, 2.5),
  base("R-JP-004", "Unsalted edamame", "Japanese", "snack", 2, 6, 3),
  base("R-ES-004", "Mini wholemeal egg wraps", "Spanish", "snack", 10, 8, 3.5),
  base("R-CN-023", "Steamed yam cubes", "Chinese", "snack", 8, 20, 2.5),
  // Breakfast items
  base("R-WE-006", "Oatmeal with sliced banana (no added sugar)", "Western", "breakfast_item", 3, 10, 2.5),
  base("R-WE-007", "Wholemeal toast with scrambled egg", "Western", "breakfast_item", 5, 8, 3),
  base("R-CN-024", "Steamed egg custard", "Chinese", "breakfast_item", 5, 12, 2.5),
  base("R-KR-005", "Pumpkin porridge", "Korean", "breakfast_item", 10, 30, 3),
  base("R-ES-005", "Potato omelette wedges (less oil)", "Spanish", "breakfast_item", 15, 25, 3.5),
  base("R-CN-025", "Steamed vegetable buns", "Chinese", "breakfast_item", 30, 15, 3.5),
];

/** Every dish the app knows about (the days above plus the swap choices), each once. */
export const library: Recipe[] = (() => {
  const seen = new Set<string>();
  const out: Recipe[] = [];
  const all = [
    ...sampleDays.flatMap((d) => SLOT_ORDER.flatMap((s) => d.slots[s])),
    ...alternatives,
  ];
  for (const r of all) {
    if (!seen.has(r.recipe_id)) { seen.add(r.recipe_id); out.push(r); }
  }
  return out;
})();

export function findRecipe(id: string): Recipe | undefined {
  return library.find((r) => r.recipe_id === id);
}
