import { i, T, BR, POULTRY, BEEF, SHELLFISH, FISH, EGGS } from "./recipe-kit";
import type { Recipe } from "./types";

/** RECIPE BOOK — Mexican-style wraps, burrito bowls and quesadillas, made mild and low in salt. Each takes 30 minutes or less. Original drafts, NOT yet taste-tested. For 8 people. */
const V = "Vegetables" as const, P = "Pantry" as const, M = "Meat" as const, S = "Seafood" as const, E = "Eggs & dairy" as const, O = "Other" as const, F = "Fruit" as const;
const oil = (n: number) => i("Cooking oil", n, "tbsp", P);
const spice = i("Mild chilli powder", 1, "tsp", P);
const cumin = i("Cumin", 1, "tsp", P);
const lime = i("Lime", 2, "piece", "Fruit", "juiced");
const beans = (n: number) => i("Black beans", n, "g", P, "canned, rinsed well");
const wraps = (n: number) => i("Wholemeal wraps", n, "piece", P);
const pan = ["Large pan"];
const SALSA = i("Tomatoes", 3, "piece", V, "diced for fresh salsa");

export const mexican: Recipe[] = [
  // WRAPS
  BR(T("R-MX-001", "Mexican-style chicken and capsicum wrap", "Mexican", "wrap", 12, 12, 0, pan,
    [i("Chicken breast", 500, "g", M, "sliced thin"), wraps(8), i("Capsicum", 2, "piece", V, "sliced"), i("Onion", 1, "piece", V, "sliced"), spice, cumin, oil(1), i("Lettuce", 1, "piece", V, "shredded"), i("Plain yoghurt", 100, "g", E), lime],
    ["Mix the chicken with the chilli powder, cumin and half the lime juice.", "Heat the oil. Cook the chicken 5 minutes. Add the capsicum and onion. Cook 4 minutes.", "Warm the wraps in a dry pan.", "Fill each wrap with chicken mix, lettuce and a spoon of yoghurt. Roll up and serve."],
    "Yoghurt and lime replace salty sauces. One wrap each (wraps carry some salt).", POULTRY, ["Gluten", "Milk"])),
  BR(T("R-MX-002", "Beef and bean wrap", "Mexican", "wrap", 10, 15, 0, pan,
    [i("Minced beef", 400, "g", M), beans(250), wraps(8), i("Onion", 1, "piece", V, "chopped"), i("Garlic", 2, "piece", V, "minced"), spice, cumin, oil(1), i("Tomatoes", 2, "piece", V, "diced"), i("Lettuce", 1, "piece", V, "shredded")],
    ["Heat the oil. Cook the onion and garlic 2 minutes. Add the beef and spices. Cook 8 minutes until browned.", "Add the beans and tomato. Cook 4 minutes.", "Warm the wraps. Fill with the mix and lettuce. Roll up and serve."],
    "Rinse the canned beans well to remove salt. No salt added.", BEEF, ["Gluten"])),
  BR(T("R-MX-003", "Egg and vegetable breakfast burrito", "Mexican", "wrap", 8, 10, 0, pan,
    [i("Eggs", 8, "piece", E), wraps(8), i("Capsicum", 1, "piece", V, "diced"), i("Spinach", 150, "g", V), i("Tomatoes", 2, "piece", V, "diced"), oil(1), i("Black pepper", 0.25, "tsp", P)],
    ["Beat the eggs with the pepper.", "Heat the oil. Cook the capsicum 2 minutes. Add the spinach and tomato until wilted.", "Pour in the egg. Stir gently until just set.", "Warm the wraps. Fill, fold the sides in and roll."],
    "Soft scrambled egg is easy for the seniors.", EGGS, ["Egg", "Gluten"])),
  BR(T("R-MX-004", "Fish and cabbage wrap", "Mexican", "wrap", 12, 10, 0, pan,
    [i("White fish", 500, "g", S, "cut in strips"), wraps(8), i("Cabbage", 300, "g", V, "shredded"), i("Carrots", 1, "piece", V, "grated"), spice, oil(1), i("Plain yoghurt", 100, "g", E), lime],
    ["Rub the fish with the chilli powder.", "Heat the oil. Cook the fish 4 to 5 minutes, turning once, until it flakes.", "Mix the cabbage, carrot, yoghurt and lime juice for slaw.", "Warm the wraps. Fill with fish and slaw. Roll up and serve."],
    "Slaw is crunchy and fresh with no salt.", FISH, ["Fish", "Gluten", "Milk"])),
  // BURRITO BOWLS
  BR(T("R-MX-011", "Chicken burrito bowl", "Mexican", "wrap", 12, 18, 0, pan,
    [i("Chicken breast", 500, "g", M, "diced"), i("Cooked rice", 1200, "g", P), beans(250), i("Sweet corn kernels", 200, "g", V), i("Tomatoes", 3, "piece", V, "diced"), i("Cucumber", 1, "piece", V, "diced"), spice, cumin, oil(1), lime, i("Lettuce", 1, "piece", V, "shredded")],
    ["Mix the chicken with the chilli powder and cumin.", "Heat the oil. Cook the chicken 8 minutes until no pink. Add the corn for the last 2 minutes.", "Warm the rice. Mix the tomato, cucumber and lime juice for fresh salsa.", "Fill bowls: rice, lettuce, chicken, beans and salsa."],
    "Build-your-own bowl: everyone can add what they like. No added salt.", POULTRY)),
  BR(T("R-MX-012", "Beef burrito bowl", "Mexican", "wrap", 10, 18, 0, pan,
    [i("Minced beef", 400, "g", M), i("Cooked rice", 1200, "g", P), beans(250), i("Onion", 1, "piece", V, "chopped"), i("Capsicum", 1, "piece", V, "diced"), i("Tomatoes", 2, "piece", V, "diced"), spice, cumin, oil(1), i("Lettuce", 1, "piece", V, "shredded"), lime],
    ["Heat the oil. Cook the onion, then the beef and spices, 8 minutes.", "Add the capsicum and beans. Cook 4 minutes.", "Warm the rice. Mix the tomato with the lime juice.", "Fill bowls: rice, lettuce, beef mix and tomato."],
    "Use lean mince. Rinse the beans well.", BEEF)),
  BR(T("R-MX-013", "Prawn burrito bowl", "Mexican", "wrap", 12, 12, 0, pan,
    [i("Prawns, peeled", 500, "g", S), i("Cooked rice", 1200, "g", P), i("Sweet corn kernels", 200, "g", V), i("Avocado", 2, "piece", F, "diced"), i("Tomatoes", 2, "piece", V, "diced"), i("Cucumber", 1, "piece", V, "diced"), spice, oil(1), lime],
    ["Mix the prawns with the chilli powder.", "Heat the oil. Cook the prawns 3 to 4 minutes until pink. Add the corn.", "Warm the rice. Mix avocado, tomato, cucumber and lime juice.", "Fill bowls: rice, prawns and fresh topping."],
    "Avocado gives healthy fat instead of cheese or cream.", SHELLFISH, ["Shellfish"])),
  BR(T("R-MX-014", "Vegetable and bean burrito bowl", "Mexican", "wrap", 12, 15, 0, pan,
    [i("Cooked rice", 1200, "g", P), beans(300), i("Sweet corn kernels", 200, "g", V), i("Capsicum", 2, "piece", V, "diced"), i("Mushrooms", 200, "g", V, "sliced"), i("Avocado", 1, "piece", F, "sliced"), spice, cumin, oil(1), lime, i("Lettuce", 1, "piece", V, "shredded")],
    ["Heat the oil. Cook the mushrooms and capsicum with the spices 6 minutes.", "Add the beans and corn. Cook 4 minutes.", "Warm the rice. Fill bowls: rice, lettuce and the vegetable mix.", "Top with avocado and lime juice."],
    "Meat-free, full of fibre and protein from beans.")),
  // QUESADILLAS
  BR(T("R-MX-021", "Chicken and cheese quesadilla", "Mexican", "wrap", 10, 15, 0, ["Large non-stick pan"],
    [i("Chicken breast", 400, "g", M, "diced small"), wraps(8), i("Grated cheese", 120, "g", E), i("Capsicum", 1, "piece", V, "diced"), i("Onion", 1, "piece", V, "chopped"), spice, oil(1)],
    ["Heat half the oil. Cook the chicken, onion and capsicum with the chilli powder for 8 minutes. Cool a little.", "On half of each wrap, put the chicken mix and a little cheese. Fold in half.", "Cook in a dry pan 2 minutes each side until golden.", "Cut into triangles and serve."],
    "Cheese is salty, so only 120 g for 8 quesadillas. No salt added.", POULTRY, ["Gluten", "Milk"])),
  BR(T("R-MX-022", "Bean and vegetable quesadilla", "Mexican", "wrap", 10, 12, 0, ["Large non-stick pan"],
    [beans(250), wraps(8), i("Grated cheese", 100, "g", E), i("Sweet corn kernels", 150, "g", V), i("Spinach", 150, "g", V), i("Tomatoes", 2, "piece", V, "diced"), cumin],
    ["Mash half the beans roughly. Mix with the rest of the beans, corn, spinach, tomato and cumin.", "Spread on half of each wrap with a little cheese. Fold in half.", "Cook in a dry pan 2 minutes each side until golden.", "Cut into triangles and serve."],
    "Meat-free. Mashed beans help the filling stick.", undefined, ["Gluten", "Milk"])),
  BR(T("R-MX-023", "Tuna and sweet corn quesadilla", "Mexican", "wrap", 8, 12, 0, ["Large non-stick pan"],
    [i("Canned tuna", 300, "g", S, "in water, drained"), wraps(8), i("Grated cheese", 100, "g", E), i("Sweet corn kernels", 200, "g", V), i("Spring onion", 3, "piece", V, "chopped"), i("Black pepper", 0.25, "tsp", P)],
    ["Mix the tuna, corn, spring onion and pepper.", "Spread on half of each wrap with a little cheese. Fold in half.", "Cook in a dry pan 2 minutes each side until golden.", "Cut into triangles and serve."],
    "Canned tuna is salty, so choose tuna in water and use no extra salt.", FISH, ["Fish", "Gluten", "Milk"])),
  BR(T("R-MX-024", "Beef and mushroom quesadilla", "Mexican", "wrap", 10, 15, 0, ["Large non-stick pan"],
    [i("Minced beef", 350, "g", M), wraps(8), i("Grated cheese", 100, "g", E), i("Mushrooms", 250, "g", V, "chopped"), i("Onion", 1, "piece", V, "chopped"), cumin, oil(1)],
    ["Heat the oil. Cook the onion, beef and cumin 6 minutes. Add the mushrooms and cook 4 minutes.", "Spread on half of each wrap with a little cheese. Fold in half.", "Cook in a dry pan 2 minutes each side until golden.", "Cut into triangles and serve."],
    "Mushrooms add taste and stretch the meat.", BEEF, ["Gluten", "Milk"])),
];
void SALSA;
