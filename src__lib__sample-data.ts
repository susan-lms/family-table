import type { Cuisine, DishClass, Recipe } from "./types";
import { batch1 } from "./recipes-batch1";
import { batch2a } from "./recipes-batch2a";
import { batch2b } from "./recipes-batch2b";
import { onepot } from "./recipes-onepot";
import { batch6Proteins, batch6Soups } from "./recipes-batch6";
import { batch5 } from "./recipes-batch5";
import { onedish } from "./recipes-onedish";
import { batch7 } from "./recipes-batch7";
import { festivalDishes } from "./recipes-festival";
import { batch4 } from "./recipes-batch4";
import { batch3all } from "./recipes-batch3";
import { estimateRecipeCost } from "./prices";
import { DISH_ZH } from "./zh-names";
import { DISH_ZH_EXTRA, DISH_ZH_ONEDISH } from "./zh-names-extra";

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

export const SLOT_LABELS: Record<string, string> = {
  lunch: "Lunch (4 people)",
  dinner: "Dinner (8 people)",
};

export const SLOT_ORDER = ["lunch", "dinner"] as const;

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
  // Vegetable dishes
  // Tea-break snacks
  ...batch1,
  ...batch2a,
  ...batch2b,
  ...batch4,
  ...batch5,
  ...onepot,
  ...batch6Proteins,
  ...batch6Soups,
  ...batch7,
  ...onedish,
  ...festivalDishes,
];

/**
 * Healthy portion: each protein dish is one of 3 per day, so the meat or fish in it is
 * cut to 60% of a "single main dish" amount (about 110 g raw per person per dish).
 */
const MEAT_FACTOR = 0.6;
const PRESIZED = new Set(batch6Proteins.map((r) => r.recipe_id)); // already written at the healthy size
const portion = (r: Recipe): Recipe => {
  if (r.dish_class !== "protein" || !r.ingredients || PRESIZED.has(r.recipe_id)) return r;
  return {
    ...r,
    ingredients: r.ingredients.map((g) => {
      if (g.category !== "Meat" && g.category !== "Seafood") return g;
      const qty = g.unit === "kg" ? Math.round(g.qty * MEAT_FACTOR * 20) / 20 : Math.max(50, Math.round((g.qty * MEAT_FACTOR) / 50) * 50);
      return { ...g, qty };
    }),
  };
};

/** Every dish the app knows about (the days above plus the swap choices), each once. Costs are ROUGH ESTIMATES from prices.ts. */
export const allRecipes: Recipe[] = (() => {
  const seen = new Set<string>();
  const out: Recipe[] = [];
  const all = [
    ...batch3all,
    gingerChicken, garlicBroccoli, gingerFish, winterMelonSoup,
    ...alternatives,
  ];
  for (const r0 of all) {
    if (seen.has(r0.recipe_id)) continue;
    seen.add(r0.recipe_id);
    const r = portion(r0);
    const cost = estimateRecipeCost(r);
    out.push({ ...(cost === undefined ? r : { ...r, estimated_cost_sgd: cost }), name_zh: DISH_ZH[r.recipe_id] ?? DISH_ZH_EXTRA[r.recipe_id] ?? DISH_ZH_ONEDISH[r.recipe_id] });
  }
  return out;
})();

/** Dish types served at lunch and dinner. Breakfast items and snacks are kept in the data but not planned (the household asked for lunch and dinner only). */
const SERVED = new Set(["protein", "vegetable", "soup", "onepot", "onedish"]);
/** Cuisines the household does not want planned. The recipes stay in the data, so this can be switched back on. */
export const EXCLUDED_CUISINES: Cuisine[] = ["Indian"];
const servedAll = allRecipes.filter((r) => SERVED.has(r.dish_class) && !EXCLUDED_CUISINES.includes(r.cuisine));
/** Dishes the normal plan and the "Change" button can use (festival-only dishes are kept apart). */
export const library: Recipe[] = servedAll.filter((r) => !r.festival);
/** Festival-only dishes, used by the festival menus. */
export const festivalLibrary: Recipe[] = servedAll.filter((r) => !!r.festival);

export function findRecipe(id: string): Recipe | undefined {
  return library.find((r) => r.recipe_id === id) ?? festivalLibrary.find((r) => r.recipe_id === id);
}
