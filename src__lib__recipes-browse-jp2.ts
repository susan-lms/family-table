import { i, T, BR, POULTRY, FISH, PORK, BEEF, EGGS, SHELLFISH, RAW } from "./recipe-kit";
import type { Recipe } from "./types";

/**
 * RECIPE BOOK, part 6 — more Japanese home cooking (rice bowls, noodles, simmered dishes, nabe, baked "fried" dishes).
 * Dish ideas follow common Japanese home-cooking categories. Every method is written fresh for this app. Low salt, sugar and oil.
 * Original drafts, NOT yet taste-tested. For 8 people.
 */
const V = "Vegetables" as const, P = "Pantry" as const, M = "Meat" as const, S = "Seafood" as const, E = "Eggs & dairy" as const, O = "Other" as const, F = "Fruit" as const;
const oil = (n: number) => i("Cooking oil", n, "tbsp", P);
const soy = (n: number) => i("Light soy sauce (low salt)", n, "tbsp", P);
const water = (ml: number) => i("Water", ml, "ml", O);
const sesame = (n: number) => i("Sesame oil", n, "tsp", P);
const garlic = (n: number) => i("Garlic", n, "piece", V);
const ginger = (g: number, prep = "sliced") => i("Ginger", g, "g", V, prep);
const mirin = (n: number) => i("Mirin", n, "tbsp", P);
const rice = (g: number) => i("Japanese short-grain rice", g, "g", P);
const miso = (n: number) => i("Low-salt miso", n, "tbsp", P);
const dashi = (ml: number) => i("Light dashi stock (no salt added)", ml, "ml", O);
const spring = (n: number) => i("Spring onion", n, "piece", V);
const wok = ["Wok"], pot = ["Pot"], lid = ["Pot with lid"], pan = ["Large pan"], tray = ["Baking tray", "Oven"], dish = ["Oven dish", "Oven"], rcook = ["Rice cooker or pot"];
const pepper2 = i("Black pepper", 0.25, "tsp", P);
const SN = "No salt added. Use light dashi and a little miso only.";

export const japaneseMore: Recipe[] = [
  BR(T("R-JB-012", "Mild Japanese-style chicken and vegetable curry", "Japanese", "onedish", 15, 30, 0, lid,
    [i("Chicken thigh, boneless", 600, "g", M, "cubed"), i("Potatoes", 500, "g", V, "cubed"), i("Carrots", 3, "piece", V, "chunks"), i("Onions", 2, "piece", V, "sliced"), i("Plain flour", 30, "g", P), i("Mild curry powder", 2, "tbsp", P), water(900), i("Apple", 1, "piece", F, "grated"), rice(500), oil(1)],
    ["Cook the rice.", "Soften the onion in the oil 5 minutes. Add the chicken, carrot and potato for 5 minutes.", "Stir in the flour and curry powder. Add the water and apple.", "Cover and simmer 20 minutes until thick and tender."],
    "Made without a salty curry block. Apple gives the gentle sweetness.", POULTRY, ["Gluten"])),
  BR(T("R-JB-013", "Yaki udon with chicken and cabbage", "Japanese", "onedish", 12, 12, 0, wok,
    [i("Udon noodles", 800, "g", P), i("Chicken breast", 300, "g", M, "sliced thin"), i("Cabbage", 300, "g", V, "shredded"), i("Carrots", 2, "piece", V, "julienne"), i("Mushrooms", 150, "g", V), soy(2), oil(2), spring(2)],
    ["Rinse the udon in hot water to loosen.", "Heat the oil. Cook the chicken 4 minutes. Add the carrot, cabbage and mushroom 4 minutes.", "Add the udon and soy sauce. Toss 3 minutes. Top with spring onion."],
    "Plenty of vegetables, a little oil.", POULTRY, ["Gluten", "Soy"]), { meal: "noodles" }),
  BR(T("R-JB-014", "Soy-glazed eggplant rice bowl", "Japanese", "onedish", 10, 18, 0, pan,
    [i("Eggplant", 700, "g", V, "chunks"), rice(500), soy(2), mirin(1), ginger(15, "grated"), oil(2), spring(2)],
    ["Cook the rice.", "Cook the eggplant in the oil with 3 spoons of water, covered, 12 minutes until soft.", "Add the soy sauce, mirin and ginger 2 minutes.", "Serve over rice with spring onion."],
    "Meat-free. Mirin is the only sweetener.", undefined, ["Soy"])),
  BR(T("R-JB-015", "Egg omelette rice bowl with prawns and vegetables (tenshinhan style)", "Japanese", "onedish", 12, 12, 0, pan,
    [rice(500), i("Eggs", 6, "piece", E), i("Prawns, peeled", 200, "g", S, "chopped"), i("Mushrooms", 150, "g", V), i("Spring onion", 3, "piece", V), i("Green peas", 100, "g", V), oil(1), soy(1), corn2(2), water(250)],
    ["Cook the rice.", "Cook the prawn, mushroom and peas in half the oil 4 minutes. Mix with the eggs.", "Cook in a pan in 4 portions until set.", "Mix the cornflour, soy sauce and water in a pan until thick. Pour over the omelettes on rice."],
    "Light sauce instead of a sweet, salty one.", SHELLFISH + " " + EGGS, ["Egg", "Shellfish", "Soy"])),
  BR(T("R-JB-016", "Simmered tofu and egg rice bowl", "Japanese", "onedish", 8, 12, 0, pan,
    [i("Firm tofu", 500, "g", P, "cubed"), i("Eggs", 5, "piece", E), i("Onion", 2, "piece", V, "sliced"), dashi(400), soy(1), mirin(1), rice(500), spring(2)],
    ["Cook the rice.", "Simmer the onion in the dashi, soy sauce and mirin 5 minutes. Add the tofu 3 minutes.", "Pour in the beaten egg. Cover 2 minutes until just set.", "Serve over rice."],
    "Soft and gentle for seniors.", EGGS, ["Egg", "Soy"])),
  BR(T("R-JB-017", "Pan-fried tofu teriyaki bowl", "Japanese", "onedish", 10, 15, 0, pan,
    [i("Firm tofu", 600, "g", P, "sliced"), i("Broccoli", 300, "g", V), rice(500), soy(2), mirin(1), ginger(10, "grated"), corn2(2), oil(2)],
    ["Cook the rice. Steam the broccoli 5 minutes.", "Pat the tofu dry. Fry in the oil 3 minutes each side.", "Mix the soy sauce, mirin, ginger, cornflour and 100 ml water. Pour in and stir until glossy.", "Serve on rice with broccoli."],
    "Little oil and no sugar.", undefined, ["Soy"])),
  BR(T("R-JB-018", "Baked teriyaki chicken meatballs", "Japanese", "protein", 18, 20, 0, tray,
    [i("Minced chicken", 600, "g", M), i("Egg", 1, "piece", E), i("Breadcrumbs", 40, "g", P), ginger(15, "grated"), spring(2), soy(2), mirin(1), corn2(1)],
    ["Heat the oven to 200°C.", "Mix the chicken, egg, crumbs, ginger and spring onion. Roll into 24 balls.", "Bake 15 minutes.", "Heat the soy sauce, mirin, cornflour and 3 spoons of water until thick. Toss the meatballs in it."],
    "Baked, not fried.", POULTRY, ["Gluten", "Egg", "Soy"])),
  BR(T("R-JB-019", "Pumpkin and chicken gratin", "Japanese", "protein", 15, 30, 0, dish,
    [i("Pumpkin (kabocha)", 700, "g", V, "cubed"), i("Chicken breast", 300, "g", M, "diced"), i("Onion", 1, "piece", V), i("Milk", 500, "ml", E), i("Plain flour", 30, "g", P), i("Cheddar, grated", 50, "g", E), oil(1)],
    ["Steam the pumpkin 10 minutes.", "Cook the onion and chicken in the oil 6 minutes. Stir in the flour then the milk until thick.", "Mix in the pumpkin. Put in a dish. Top with cheese.", "Bake at 200°C for 15 minutes."],
    "Pumpkin sweetness means little cheese is needed.", POULTRY, ["Gluten", "Milk"])),
  BR(T("R-JB-020", "Baked pumpkin croquettes", "Japanese", "vegetable", 25, 25, 0, tray,
    [i("Pumpkin (kabocha)", 800, "g", V, "cubed"), i("Minced chicken", 200, "g", M), i("Onion", 1, "piece", V, "finely chopped"), i("Breadcrumbs", 80, "g", P), i("Egg", 1, "piece", E), oil(2)],
    ["Steam and mash the pumpkin. Cook the onion and chicken in half the oil 6 minutes. Mix together.", "Shape into 16 small patties. Coat with egg then crumbs.", "Bake on an oiled tray at 210°C for 20 minutes, turning once."],
    "Baked, not deep-fried.", POULTRY, ["Gluten", "Egg"])),
  BR(T("R-JB-021", "Prawn and broccoli pasta with garlic and lemon (wafu style)", "Japanese", "onedish", 10, 15, 0, pan,
    [i("Spaghetti", 500, "g", P), i("Prawns, peeled", 400, "g", S), i("Broccoli", 400, "g", V, "small florets"), garlic(4), i("Lemon", 1, "piece", F), oil(2), soy(1)],
    ["Cook the pasta. Add the broccoli the last 3 minutes. Drain, keep a cup of water.", "Fry the garlic in the oil. Add the prawns 3 minutes until pink.", "Toss with the pasta, soy sauce, lemon juice and a little pasta water."],
    "Garlic, lemon and a touch of soy replace cheese and cream.", SHELLFISH, ["Gluten", "Shellfish", "Soy"]), { meal: "noodles" }),
  BR(T("R-JB-022", "Soba salad with cucumber and egg", "Japanese", "salad", 12, 8, 0, pot,
    [i("Soba noodles", 400, "g", P), i("Cucumbers", 2, "piece", V, "julienne"), i("Eggs", 4, "piece", E), i("Carrots", 2, "piece", V, "julienne"), i("Rice vinegar", 2, "tbsp", P), soy(1), sesame(1)],
    ["Hard-boil the eggs 10 minutes. Cool and slice.", "Cook the soba. Rinse in cold water. Drain well.", "Mix the vinegar, soy sauce and sesame oil. Toss with the noodles and vegetables. Top with egg."],
    "Vinegar dressing, little salt. Chill and eat the same day.", EGGS + " " + RAW, ["Gluten", "Egg", "Soy", "Sesame"])),
  BR(T("R-JB-023", "Miso pasta with tuna and cabbage", "Japanese", "onedish", 10, 15, 0, pan,
    [i("Spaghetti", 500, "g", P), i("Tuna in water", 300, "g", P, "drained"), i("Cabbage", 400, "g", V, "shredded"), miso(1), i("Butter", 20, "g", E), garlic(2), water(100)],
    ["Cook the pasta. Drain, keep a cup of water.", "Melt the butter. Cook the garlic and cabbage 5 minutes.", "Mix the miso with a little water. Add the tuna and pasta. Toss 2 minutes, adding pasta water if dry."],
    "Only 1 spoon of miso for 8 people.", FISH, ["Gluten", "Fish", "Milk", "Soy"]), { meal: "noodles" }),
  BR(T("R-JB-024", "Cabbage and prawn pancakes (okonomiyaki style)", "Japanese", "protein", 15, 15, 0, pan,
    [i("Cabbage", 500, "g", V, "finely shredded"), i("Plain flour", 200, "g", P), i("Eggs", 4, "piece", E), i("Prawns, peeled", 200, "g", S, "chopped"), spring(3), water(250), oil(2)],
    ["Whisk the flour, eggs and water. Mix in the cabbage, prawns and spring onion.", "Heat a little oil in a pan. Cook a quarter of the mix 5 minutes each side until golden.", "Repeat. Cut into wedges."],
    "No bottled sauce, which is high in salt and sugar.", SHELLFISH + " " + EGGS, ["Gluten", "Egg", "Shellfish"])),
  BR(T("R-JB-025", "Yakitori-style chicken and spring onion skewers", "Japanese", "protein", 15, 15, 0, tray,
    [i("Chicken thigh, boneless", 800, "g", M, "cubed"), i("Spring onion", 6, "piece", V, "in chunks"), soy(2), mirin(1), ginger(10, "grated")],
    ["Heat the oven grill. Soak 16 wooden skewers.", "Thread the chicken and spring onion.", "Brush with the soy sauce, mirin and ginger. Grill 12 to 15 minutes, turning.", "Check no pink."],
    "Grilled without extra oil.", POULTRY, ["Soy"])),
  BR(T("R-JB-026", "Chicken and vegetable hot pot (nabe)", "Japanese", "soup", 15, 25, 0, pot,
    [i("Chicken thigh, boneless", 500, "g", M, "sliced"), i("Napa cabbage", 500, "g", V), i("Mushrooms", 250, "g", V), i("Firm tofu", 300, "g", P, "cubed"), i("Carrots", 2, "piece", V, "sliced"), i("Daikon", 300, "g", V, "sliced"), dashi(1800)],
    ["Heat the dashi in a wide pot.", "Add the daikon and carrot 8 minutes. Add the chicken 6 minutes.", "Add the cabbage, mushroom and tofu 8 minutes.", "Serve with the hot broth."],
    SN, POULTRY, ["Soy"])),
  BR(T("R-JB-027", "Pork and vegetable hot pot (nabe)", "Japanese", "soup", 15, 25, 0, pot,
    [i("Lean pork, thin sliced", 400, "g", M), i("Napa cabbage", 500, "g", V), i("Enoki mushrooms", 200, "g", V), i("Firm tofu", 300, "g", P), i("Spinach", 200, "g", V), ginger(15), dashi(1800)],
    ["Heat the dashi with the ginger.", "Add the cabbage 8 minutes.", "Add the pork, tofu and mushroom 6 minutes until the pork is cooked.", "Add the spinach 1 minute."],
    SN, PORK, ["Soy"])),
  BR(T("R-JB-028", "Egg salad sandwiches (tamago sando style)", "Japanese", "onedish", 15, 10, 0, pot,
    [i("Eggs", 8, "piece", E), i("Soft white or wholemeal bread", 16, "piece", P), i("Plain yoghurt", 80, "g", E), i("Cucumber", 1, "piece", V, "sliced"), pepper2],
    ["Hard-boil the eggs 10 minutes. Cool, peel and chop.", "Mix with the yoghurt and pepper.", "Spread on 8 slices, add cucumber, top with the rest. Cut."],
    "Yoghurt replaces salty mayonnaise.", EGGS, ["Gluten", "Egg", "Milk"]), { meal: "sandwich" }),
  BR(T("R-JB-029", "Salmon chazuke (rice in warm green tea)", "Japanese", "onedish", 8, 12, 0, pan,
    [i("Salmon fillets", 500, "g", S), rice(500), i("Green tea", 1200, "ml", O, "hot"), i("Spring onion", 3, "piece", V), i("Nori sheets", 2, "piece", P, "cut thin")],
    ["Cook the rice.", "Grill or pan-fry the salmon 10 minutes until cooked through. Flake.", "Put rice in bowls, top with salmon. Pour on the hot tea. Add spring onion and nori."],
    "Comforting and easy to swallow.", FISH, ["Fish"])),
  BR(T("R-JB-030", "Simmered fish with ginger", "Japanese", "protein", 8, 15, 0, pan,
    [i("White fish fillets", 800, "g", S), ginger(30), soy(2), mirin(1), water(250), spring(2)],
    ["Boil the ginger, soy sauce, mirin and water in a pan.", "Add the fish. Simmer 10 to 12 minutes, spooning the liquid over.", "Top with spring onion."],
    "Light braise, no fry.", FISH, ["Fish", "Soy"])),
  BR(T("R-JB-031", "Miso-glazed eggplant (nasu dengaku style)", "Japanese", "vegetable", 10, 25, 0, tray,
    [i("Eggplant", 800, "g", V, "halved"), miso(1), mirin(1), i("Sesame seeds", 1, "tsp", P), oil(1)],
    ["Heat the oven to 220°C. Score the eggplant. Brush with oil.", "Bake 20 minutes until soft.", "Mix the miso and mirin with a spoon of water. Spread on top. Grill 3 minutes. Add sesame."],
    "Very little miso, spread thin.", undefined, ["Soy", "Sesame"])),
  BR(T("R-JB-032", "Chilled tofu with ginger and spring onion (hiyayakko)", "Japanese", "protein", 8, 0, 0, ["Plate"],
    [i("Silken tofu", 600, "g", P), ginger(15, "grated"), spring(3), soy(1), i("Sesame seeds", 1, "tsp", P)],
    ["Drain the tofu. Cut in 8 pieces.", "Top with ginger, spring onion and sesame.", "Drizzle the soy sauce."],
    "No cooking, very soft.", RAW, ["Soy", "Sesame"])),
  BR(T("R-JB-033", "Mushroom and vegetable ramen-style noodle soup", "Japanese", "soup", 12, 25, 0, pot,
    [i("Wheat noodles", 500, "g", P), i("Mushrooms", 300, "g", V), i("Dried shiitake mushrooms", 6, "piece", P, "soaked"), i("Choy sum", 300, "g", V), i("Eggs", 4, "piece", E), i("Corn kernels", 150, "g", V), ginger(15), water(2200), miso(1)],
    ["Boil the water with the shiitake and its soaking water, ginger and mushrooms 15 minutes.", "Soft-boil the eggs 7 minutes. Peel.", "Whisk the miso into the broth. Cook the noodles. Add the choy sum 2 minutes.", "Serve with egg and corn."],
    SN, EGGS, ["Gluten", "Egg", "Soy"]), { meal: "noodles" }),
  BR(T("R-JB-034", "Chicken and egg fried rice (Japanese style)", "Japanese", "onedish", 10, 12, 0, wok,
    [i("Cooked short-grain rice, cold", 1200, "g", P), i("Chicken breast", 250, "g", M, "diced"), i("Eggs", 4, "piece", E), i("Carrots", 2, "piece", V, "diced"), i("Green peas", 100, "g", V), spring(3), soy(1), oil(2)],
    ["Use rice cooked the day before and chilled.", "Heat the oil. Cook the chicken 5 minutes. Scramble the eggs.", "Add the carrot and peas 3 minutes. Add the rice and soy sauce. Stir 4 minutes. Add spring onion."],
    "Cold rice means less oil. Chill leftover rice quickly.", POULTRY + " " + EGGS, ["Egg", "Soy"])),
  BR(T("R-JB-035", "Egg and cucumber sushi rolls (low salt)", "Japanese", "onedish", 30, 15, 0, ["Bamboo mat or plastic wrap", "Sharp knife"],
    [rice(500), i("Nori sheets", 8, "piece", P), i("Eggs", 4, "piece", E), i("Cucumbers", 2, "piece", V, "strips"), i("Carrots", 2, "piece", V, "strips, steamed"), i("Rice vinegar", 3, "tbsp", P)],
    ["Cook the rice. Mix in the vinegar while warm. Cool.", "Cook the eggs as a thin flat omelette. Cut in strips.", "Spread rice on the nori. Add the egg, cucumber and carrot in a line.", "Roll tightly. Cut in 6 pieces."],
    "No salty fillings or soy dip needed. Eat the same day.", EGGS, ["Egg", "Soy"])),
];

function corn2(n: number) { return i("Cornflour", n, "tsp", "Pantry"); }
