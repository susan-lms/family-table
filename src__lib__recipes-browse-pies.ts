import { i, T, BR, POULTRY, FISH, BEEF, EGGS } from "./recipe-kit";
import type { Recipe } from "./types";

/** RECIPE BOOK — savoury and sweet pies. Ready-made puff pastry sheets keep each one to 30 minutes or less. Pies are a treat, so sugar is cut right down and the pastry is used as a lid or base only. Original drafts, NOT yet taste-tested. Makes 8 portions. */
const V = "Vegetables" as const, P = "Pantry" as const, M = "Meat" as const, S = "Seafood" as const, E = "Eggs & dairy" as const, O = "Other" as const, F = "Fruit" as const;
const oil = (n: number) => i("Olive oil", n, "tbsp", P);
const dish = ["Pie dish", "Oven"];
const PASTRY_NOTE = " Pastry is rich: one sheet makes 8 portions, so each person has a thin slice.";
const sheet = (n: number) => i("Puff pastry sheet", n, "piece", P, "thawed");
const eggwash = i("Eggs", 1, "piece", E, "beaten, for brushing");

export const piesSavoury: Recipe[] = [
  BR(T("R-PI-001", "Chicken and mushroom pot pie", "Western", "pie", 12, 18, 0, ["Pan", ...dish],
    [i("Chicken breast", 500, "g", M, "diced"), i("Mushrooms", 250, "g", V, "sliced"), i("Carrots", 1, "piece", V, "diced"), i("Green peas", 100, "g", V), i("Onion", 1, "piece", V, "chopped"), i("Cornflour", 1, "tbsp", P), i("Milk", 250, "ml", E), oil(1), sheet(1), eggwash],
    ["Heat the oven to 200°C.", "Heat the oil. Cook the onion, chicken and carrot 6 minutes. Add the mushrooms and peas, 3 minutes.", "Mix the cornflour with the milk. Pour in and stir 2 minutes until thick. Put in a pie dish.", "Cover with the pastry. Cut 3 slits. Brush with egg.", "Bake 15 minutes until golden. Serve."],
    "Pastry on top only, no base, to save fat. No added salt." + PASTRY_NOTE, POULTRY, ["Egg", "Milk", "Gluten"]), { sweet: false }),
  BR(T("R-PI-002", "Beef and vegetable pie", "Western", "pie", 12, 18, 0, ["Pan", ...dish],
    [i("Minced beef", 400, "g", M), i("Carrots", 2, "piece", V, "diced"), i("Onion", 1, "piece", V, "chopped"), i("Green peas", 100, "g", V), i("Tomato paste", 2, "tbsp", P), i("Cornflour", 1, "tbsp", P), i("Water", 250, "ml", O), oil(1), sheet(1), eggwash],
    ["Heat the oven to 200°C.", "Heat the oil. Cook the onion and beef 6 minutes. Add the carrot, peas, tomato paste and water. Simmer 8 minutes.", "Stir in the cornflour (mixed with 1 tbsp water). Cook 1 minute. Put in a dish.", "Cover with pastry. Cut slits. Brush with egg.", "Bake 15 minutes until golden."],
    "Lean mince, and plenty of vegetables." + PASTRY_NOTE, BEEF, ["Egg", "Gluten"])),
  BR(T("R-PI-003", "Fish and potato pie", "Western", "pie", 12, 18, 0, ["Pot", ...dish],
    [i("White fish", 500, "g", S, "chunks"), i("Potatoes", 800, "g", V, "cubed"), i("Spinach", 150, "g", V), i("Milk", 200, "ml", E), i("Plain yoghurt", 3, "tbsp", E), i("Spring onion", 3, "piece", V, "chopped"), i("Black pepper", 0.25, "tsp", P)],
    ["Boil the potato 12 minutes. Drain and mash with the yoghurt.", "Meanwhile poach the fish in the milk 5 minutes. Add the spinach and spring onion for 1 minute.", "Put the fish mix in a dish. Top with the mash.", "Grill or bake at 220°C for 6 minutes until golden. Serve."],
    "No pastry, so less fat and salt. Very soft: good for the seniors.", FISH, ["Fish", "Milk"])),
  BR(T("R-PI-004", "Spinach and egg pie", "Western", "pie", 10, 18, 0, dish,
    [i("Spinach", 400, "g", V), i("Eggs", 5, "piece", E), i("Grated cheese", 60, "g", E), i("Onion", 1, "piece", V, "chopped"), oil(1), sheet(1), i("Black pepper", 0.25, "tsp", P)],
    ["Heat the oven to 200°C. Line a pie dish with the pastry.", "Cook the onion in the oil 3 minutes. Add the spinach until wilted. Squeeze out extra water.", "Mix with 4 beaten eggs, the cheese and pepper. Pour into the dish.", "Bake 18 minutes until set and golden."],
    "Cheese is salty: only 60 g for 8 portions." + PASTRY_NOTE, EGGS, ["Egg", "Milk", "Gluten"])),
  BR(T("R-PI-005", "Tuna and sweet corn pie", "Western", "pie", 10, 18, 0, dish,
    [i("Canned tuna", 300, "g", S, "in water, drained"), i("Sweet corn kernels", 200, "g", V), i("Eggs", 3, "piece", E), i("Spring onion", 3, "piece", V, "chopped"), i("Milk", 150, "ml", E), sheet(1), i("Black pepper", 0.25, "tsp", P)],
    ["Heat the oven to 200°C. Line a pie dish with the pastry.", "Mix the tuna, corn, spring onion, eggs, milk and pepper. Pour in.", "Bake 18 minutes until set and golden. Serve."],
    "Tuna in water, no extra salt." + PASTRY_NOTE, FISH + " " + EGGS, ["Fish", "Egg", "Milk", "Gluten"])),
];

const sweetNote = " A sweet treat: serve a small slice. Sugar is cut right down, and the fruit gives the sweetness.";

export const piesSweet: Recipe[] = [
  BR(T("R-PS-001", "Apple pie", "Western", "pie", 12, 18, 0, ["Pot", ...dish],
    [i("Apples", 6, "piece", F, "peeled, thin slices"), i("Cinnamon", 1, "tsp", P), i("Lemon", 1, "piece", F, "juiced"), i("Raisins", 40, "g", F), i("Water", 50, "ml", O), sheet(1), eggwash],
    ["Heat the oven to 200°C.", "Cook the apple, cinnamon, lemon juice, raisins and water in a pot 8 minutes until just soft.", "Put in a dish. Cover with pastry. Cut slits. Brush with egg.", "Bake 15 to 18 minutes until golden."],
    "No added sugar: the apples and raisins are sweet enough." + sweetNote, undefined, ["Egg", "Gluten"]), { sweet: true }),
  BR(T("R-PS-002", "Pear and cinnamon pie", "Western", "pie", 12, 18, 0, ["Pot", ...dish],
    [i("Pear", 6, "piece", F, "peeled, thin slices"), i("Cinnamon", 1, "tsp", P), i("Lemon", 1, "piece", F, "juiced"), i("Cornflour", 1, "tsp", P), sheet(1), eggwash],
    ["Heat the oven to 200°C.", "Cook the pear, cinnamon, lemon juice and cornflour 6 minutes.", "Put in a dish. Cover with pastry. Brush with egg.", "Bake 15 to 18 minutes until golden."],
    "No added sugar." + sweetNote, undefined, ["Egg", "Gluten"]), { sweet: true }),
  BR(T("R-PS-003", "Sweet potato pie", "Western", "pie", 10, 20, 0, ["Pot", ...dish],
    [i("Sweet potato", 700, "g", V, "peeled, cubed"), i("Eggs", 2, "piece", E), i("Milk", 150, "ml", E), i("Cinnamon", 1, "tsp", P), sheet(1)],
    ["Heat the oven to 200°C. Line a dish with the pastry.", "Boil the sweet potato 12 minutes until very soft. Drain and mash.", "Mix with the eggs, milk and cinnamon. Pour in.", "Bake 20 minutes until set."],
    "Sweet potato is naturally sweet: no sugar. Soft for the seniors." + sweetNote, EGGS, ["Egg", "Milk", "Gluten"]), { sweet: true }),
  BR(T("R-PS-004", "Banana oat crumble pie", "Western", "pie", 10, 18, 0, dish,
    [i("Banana", 6, "piece", F, "sliced"), i("Rolled oats", 100, "g", P), i("Cinnamon", 1, "tsp", P), i("Unsalted butter", 30, "g", E, "melted"), i("Lemon", 1, "piece", F, "juiced")],
    ["Heat the oven to 190°C.", "Lay the banana in a dish. Sprinkle the lemon juice.", "Mix the oats, cinnamon and butter. Spread over the banana.", "Bake 18 minutes until the top is golden."],
    "No pastry and no added sugar. Ripe bananas are very sweet." + sweetNote, undefined, ["Milk"]), { sweet: true }),
  BR(T("R-PS-005", "Mini egg tarts", "Chinese", "pie", 12, 18, 0, ["Muffin tray", "Oven"],
    [sheet(1), i("Eggs", 3, "piece", E), i("Milk", 200, "ml", E, "warm"), i("Rock sugar", 20, "g", P, "dissolved in the warm milk")],
    ["Heat the oven to 200°C.", "Cut the pastry into 12 rounds. Press into a muffin tray.", "Mix the eggs with the sweet warm milk. Sieve. Pour into the cases.", "Bake 15 to 18 minutes until the filling is set and the tops have light brown spots. Cool and serve."],
    "Only 20 g sugar for 12 tarts (about 1.5 g each)." + sweetNote, EGGS, ["Egg", "Milk", "Gluten"]), { sweet: true }),
];

export const pies: Recipe[] = [...piesSavoury, ...piesSweet];
