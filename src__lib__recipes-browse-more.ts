import { i, T, BR, POULTRY, FISH, PORK, BEEF, EGGS, SHELLFISH, RAW } from "./recipe-kit";
import type { Recipe } from "./types";

/** RECIPE BOOK, part 2 — more Western, lamb, Mexican-style, pie and salad recipes, including slower classics. Original drafts, NOT yet taste-tested. For 8 people (pies make 8 portions). */
const V = "Vegetables" as const, P = "Pantry" as const, M = "Meat" as const, S = "Seafood" as const, E = "Eggs & dairy" as const, O = "Other" as const, F = "Fruit" as const;
const olive = (n: number, u: "tbsp" | "tsp" = "tbsp") => i("Olive oil", n, u, P);
const oil = (n: number) => i("Cooking oil", n, "tbsp", P);
const water = (ml: number) => i("Water", ml, "ml", O);
const herbs = i("Dried mixed herbs", 1, "tsp", P);
const pepper = i("Black pepper", 0.25, "tsp", P);
const pot = ["Pot"], pan = ["Large pan"], tray = ["Baking tray", "Oven"], dish = ["Baking dish", "Oven"];
const SOUP2 = "No salt added. Skim the foam and fat for a clear soup.";
const LAMB = "Cook lamb until it is no longer pink and very tender. Keep raw lamb away from other food.";
const wraps = (n: number) => i("Wholemeal wraps", n, "piece", P);
const beans = (n: number) => i("Black beans", n, "g", P, "canned, rinsed well");
const sheet = i("Puff pastry sheet", 1, "piece", P, "thawed");
const eggwash = i("Eggs", 1, "piece", E, "beaten, for brushing");
const PASTRY = " Pastry is rich: one sheet makes 8 portions, so each person has a thin slice.";

export const westMore: Recipe[] = [
  BR(T("R-WB-011", "Paprika baked chicken with potatoes", "Western", "protein", 15, 45, 0, tray,
    [i("Chicken thigh, bone-in", 1000, "g", M), i("Potatoes", 700, "g", V, "wedges"), i("Paprika", 2, "tsp", P), i("Garlic", 4, "piece", V, "sliced"), olive(1), i("Lemon", 1, "piece", F, "juiced")],
    ["Heat the oven to 200°C.", "Toss the chicken and potato with the paprika, garlic, oil and lemon juice on a tray.", "Bake 40 to 45 minutes, turning once, until golden and the chicken has no pink.", "Serve."],
    "No salt: paprika and lemon give the taste. Take the skin off for less fat.", POULTRY)),
  BR(T("R-WB-012", "Slow beef and vegetable stew", "Western", "protein", 20, 100, 0, ["Heavy pot with lid"],
    [i("Beef chuck", 700, "g", M, "cubes"), i("Carrots", 3, "piece", V, "chunks"), i("Potatoes", 500, "g", V, "chunks"), i("Onion", 2, "piece", V, "chopped"), i("Celery", 150, "g", V), i("Tomato paste", 2, "tbsp", P), olive(1), herbs, water(1000)],
    ["Heat the oil. Brown the beef in two batches, 5 minutes each. Remove.", "Cook the onion 3 minutes. Add the tomato paste, herbs, beef and water. Bring to the boil.", "Cover and simmer 60 minutes. Add the carrot, celery and potato.", "Simmer 30 minutes more until the beef is very tender. Serve."],
    "Slow cooking makes cheap beef soft for the seniors. No salt added.", BEEF)),
  BR(T("R-WB-013", "Beef bolognese with wholemeal spaghetti", "Western", "onedish", 15, 40, 0, pot,
    [i("Minced beef", 400, "g", M), i("Wholemeal spaghetti", 400, "g", P), i("Canned tomatoes", 800, "g", P), i("Carrots", 2, "piece", V, "grated"), i("Mushrooms", 200, "g", V, "chopped"), i("Onion", 1, "piece", V, "chopped"), i("Garlic", 3, "piece", V), olive(1), herbs],
    ["Heat the oil. Cook the onion and garlic 3 minutes. Add the beef and cook 8 minutes.", "Add carrot, mushroom, tomatoes and herbs. Simmer 25 minutes.", "Cook the spaghetti in plain unsalted water until soft. Drain.", "Mix and serve."],
    "Half the beef of a normal recipe; vegetables fill it out. No salt in the sauce or the water.", BEEF, ["Gluten"]), { meal: "noodles" }),
  BR(T("R-WB-014", "Salmon fish cakes", "Western", "protein", 20, 15, 0, ["Non-stick pan"],
    [i("Salmon fillet", 400, "g", S), i("Potatoes", 400, "g", V, "boiled and mashed"), i("Spring onion", 3, "piece", V, "chopped"), i("Eggs", 1, "piece", E), i("Wholemeal breadcrumbs", 40, "g", P), i("Lemon", 1, "piece", F, "juiced"), oil(1)],
    ["Steam the salmon 8 minutes. Flake it.", "Mix with the mash, spring onion, egg and lemon juice. Shape into 8 patties.", "Coat in the breadcrumbs.", "Cook in the oil 4 to 5 minutes each side until golden. Serve."],
    "Pan-fried in 1 tbsp oil. Potato stretches the salmon.", FISH, ["Fish", "Egg", "Gluten"])),
  BR(T("R-WB-015", "Pork and apple casserole", "Western", "protein", 15, 50, 0, ["Heavy pot with lid"],
    [i("Lean pork", 700, "g", M, "cubes"), i("Apples", 3, "piece", F, "chunks"), i("Onion", 2, "piece", V, "sliced"), i("Carrots", 2, "piece", V, "chunks"), olive(1), herbs, water(500)],
    ["Heat the oil. Brown the pork 5 minutes. Add the onion 3 minutes.", "Add carrot, herbs and water. Cover and simmer 35 minutes.", "Add the apple. Simmer 10 minutes more.", "Serve."],
    "Apple gives a natural sweetness. No salt or sugar.", PORK)),
  BR(T("R-WB-016", "Chicken and vegetable casserole", "Western", "protein", 15, 40, 0, ["Heavy pot with lid"],
    [i("Chicken thigh, bone-in", 1000, "g", M), i("Carrots", 2, "piece", V), i("Potatoes", 500, "g", V), i("Celery", 150, "g", V), i("Onion", 1, "piece", V), i("Green peas", 100, "g", V), herbs, water(700)],
    ["Put the chicken, carrot, potato, celery, onion, herbs and water in a pot. Bring to the boil.", "Cover and simmer 35 minutes.", "Add the peas for the last 5 minutes.", "Serve in bowls with the broth."],
    "Everything in one pot. No oil, no salt.", POULTRY)),
  BR(T("R-WB-017", "Poached fish in tomato broth", "Western", "protein", 10, 20, 0, pan,
    [i("White fish", 700, "g", S, "thick fillets"), i("Canned tomatoes", 400, "g", P), i("Onion", 1, "piece", V, "sliced"), i("Garlic", 3, "piece", V), olive(1), herbs, water(150)],
    ["Heat the oil. Cook the onion and garlic 3 minutes. Add the tomatoes, herbs and water. Simmer 8 minutes.", "Lay the fish in the sauce. Cover and cook 8 to 10 minutes until it flakes.", "Serve with the sauce."],
    "No added salt or sugar.", FISH, ["Fish"])),
  BR(T("R-WB-018", "Cottage pie with sweet potato", "Western", "protein", 20, 40, 0, ["Pan", ...dish],
    [i("Minced beef", 500, "g", M), i("Sweet potato", 800, "g", V, "chunks"), i("Carrots", 2, "piece", V, "diced"), i("Green peas", 100, "g", V), i("Onion", 1, "piece", V, "chopped"), i("Tomato paste", 2, "tbsp", P), olive(1), water(250)],
    ["Boil the sweet potato 15 minutes. Drain and mash.", "Heat the oil. Cook the onion and beef 8 minutes. Add carrot, peas, tomato paste and water. Simmer 12 minutes.", "Put the beef in a dish. Cover with mash.", "Bake at 200°C for 15 minutes. Serve."],
    "Soft and mild. No butter or cream.", BEEF)),
  BR(T("R-WB-019", "Chicken and mushroom pasta bake", "Western", "onedish", 15, 35, 0, ["Pot", ...dish],
    [i("Wholemeal pasta", 400, "g", P), i("Chicken breast", 450, "g", M, "diced"), i("Mushrooms", 300, "g", V), i("Canned tomatoes", 400, "g", P), i("Spinach", 150, "g", V), i("Grated cheese", 80, "g", E), olive(1), herbs],
    ["Boil the pasta in plain unsalted water 8 minutes. Drain.", "Heat the oil. Cook the chicken and mushrooms 8 minutes. Add tomatoes and herbs, simmer 5 minutes. Add spinach.", "Mix with the pasta in a dish. Top with cheese.", "Bake at 200°C for 12 minutes."],
    "Cheese is salty: only 80 g for 8 people.", POULTRY, ["Gluten", "Milk"]), { meal: "noodles" }),
  BR(T("R-WB-020", "Chicken meatloaf", "Western", "protein", 15, 40, 0, ["Loaf tin", "Oven"],
    [i("Minced chicken", 700, "g", M), i("Carrots", 1, "piece", V, "grated"), i("Zucchini", 200, "g", V, "grated"), i("Onion", 1, "piece", V, "grated"), i("Eggs", 1, "piece", E), i("Wholemeal breadcrumbs", 50, "g", P), i("Tomato paste", 1, "tbsp", P), herbs],
    ["Heat the oven to 190°C.", "Mix everything well. Press into a lined loaf tin.", "Bake 40 minutes until no pink and the middle reaches 74°C.", "Rest 5 minutes. Slice and serve."],
    "Hidden vegetables make it moist, so no gravy or salt is needed.", POULTRY + " " + EGGS, ["Egg", "Gluten"])),
  BR(T("R-WB-021", "Chicken and vegetable fried rice", "Western", "onedish", 12, 12, 0, pan,
    [i("Cooked rice", 1400, "g", P, "cold"), i("Chicken breast", 350, "g", M, "diced small"), i("Eggs", 3, "piece", E), i("Carrots", 2, "piece", V, "diced"), i("Green peas", 100, "g", V), i("Spring onion", 3, "piece", V), oil(2), i("Light soy sauce (low salt)", 1, "tbsp", P)],
    ["Heat half the oil. Cook the chicken 5 minutes. Remove.", "Heat the rest. Scramble the eggs. Add the carrot and peas 3 minutes.", "Add the cold rice and chicken. Stir 4 minutes. Add soy sauce and spring onion.", "Serve."],
    "Cold rice fries better. 2 tbsp oil for 8 people.", POULTRY + " " + EGGS, ["Egg", "Soy"])),
  BR(T("R-WB-022", "Roast pumpkin and vegetable tray", "Western", "vegetable", 12, 35, 0, tray,
    [i("Pumpkin", 600, "g", V, "chunks"), i("Carrots", 2, "piece", V), i("Zucchini", 300, "g", V), i("Capsicum", 2, "piece", V), i("Onion", 1, "piece", V, "wedges"), olive(1), herbs],
    ["Heat the oven to 220°C.", "Toss all the vegetables with the oil and herbs on a tray.", "Roast 30 to 35 minutes, turning once, until soft and golden.", "Serve."],
    "Roasting brings out sweetness; no salt needed.")),
  BR(T("R-WB-023", "Vegetable omelette", "Western", "protein", 8, 10, 0, ["Non-stick pan"],
    [i("Eggs", 8, "piece", E), i("Tomatoes", 2, "piece", V, "diced"), i("Mushrooms", 150, "g", V, "sliced"), i("Spring onion", 2, "piece", V), olive(1), pepper],
    ["Beat the eggs with the pepper.", "Heat the oil. Cook the mushroom 3 minutes. Add the tomato.", "Pour in the egg. Cook on medium-low heat until set, 5 minutes. Fold and serve."],
    "Quick and soft. No cheese or salt.", EGGS, ["Egg"])),
  BR(T("R-WB-024", "Baked cod with sweet potato mash", "Western", "protein", 10, 25, 0, tray,
    [i("Cod", 700, "g", S, "fillets"), i("Sweet potato", 700, "g", V, "chunks"), i("Lemon", 1, "piece", F, "sliced"), i("Fresh parsley", 10, "g", V), olive(1), i("Green beans", 300, "g", V)],
    ["Heat the oven to 200°C. Boil the sweet potato 15 minutes. Mash.", "Put the cod on a tray with the lemon and oil. Bake 12 to 15 minutes.", "Steam the beans 6 minutes.", "Serve the cod with mash, beans and parsley."],
    "Mild, soft fish. No salt or butter.", FISH, ["Fish"])),
];

export const westSoupsMore: Recipe[] = [
  BR(T("R-WB-106", "Red lentil and vegetable soup", "Western", "soup", 10, 30, 0, pot,
    [i("Red lentils", 250, "g", P, "rinsed"), i("Carrots", 2, "piece", V, "diced"), i("Onion", 1, "piece", V), i("Celery", 100, "g", V), i("Garlic", 2, "piece", V), i("Cumin", 1, "tsp", P), olive(1), water(1800)],
    ["Heat the oil. Cook the onion, carrot, celery and garlic 5 minutes.", "Add the lentils, cumin and water. Simmer 25 minutes until soft.", "Blend or mash lightly. Serve."],
    "Plant protein and fibre. No salt added.")),
  BR(T("R-WB-107", "Chicken noodle soup", "Western", "soup", 10, 30, 0, pot,
    [i("Chicken thigh, bone-in", 600, "g", M), i("Carrots", 2, "piece", V), i("Celery", 100, "g", V), i("Onion", 1, "piece", V), i("Wholemeal spaghetti", 120, "g", P, "broken short"), water(2000), herbs],
    ["Put the chicken, vegetables, herbs and water in a pot. Boil, then simmer 20 minutes.", "Take out the chicken. Shred, discarding skin and bones.", "Add the pasta to the broth. Cook 8 minutes. Return the chicken. Serve."],
    "No stock cubes: the chicken makes its own broth.", POULTRY, ["Gluten"])),
  BR(T("R-WB-108", "Potato and leek soup", "Western", "soup", 10, 25, 0, ["Pot", "Blender"],
    [i("Potatoes", 600, "g", V, "cubed"), i("Leeks", 300, "g", V, "sliced"), i("Onion", 1, "piece", V), olive(1), water(1500), pepper],
    ["Heat the oil. Cook the leek and onion 5 minutes.", "Add the potato and water. Simmer 15 minutes.", "Blend until smooth. Add pepper. Serve."],
    "Creamy without cream. No salt.")),
  BR(T("R-WB-109", "Beef and barley soup", "Western", "soup", 15, 90, 0, pot,
    [i("Beef chuck", 400, "g", M, "small cubes"), i("Pearl barley", 100, "g", P), i("Carrots", 2, "piece", V), i("Celery", 100, "g", V), i("Onion", 1, "piece", V), water(2200), herbs],
    ["Boil the beef 5 minutes. Drain and rinse.", "Put everything in a pot with fresh water. Boil.", "Simmer 80 minutes until the beef and barley are soft.", "Serve."],
    "Slow and soft. No salt added.", BEEF, ["Gluten"])),
  BR(T("R-WB-110", "Cauliflower soup", "Western", "soup", 8, 20, 0, ["Pot", "Blender"],
    [i("Cauliflower", 700, "g", V, "florets"), i("Potatoes", 200, "g", V), i("Onion", 1, "piece", V), olive(1), water(1500), pepper],
    ["Heat the oil. Cook the onion 3 minutes.", "Add the cauliflower, potato and water. Simmer 15 minutes.", "Blend until smooth. Add pepper. Serve."],
    "Smooth and mild. No cream or salt.")),
  BR(T("R-WB-111", "Fish and vegetable chowder (no cream)", "Western", "soup", 12, 25, 0, pot,
    [i("White fish", 400, "g", S, "chunks"), i("Potatoes", 400, "g", V, "diced"), i("Sweet corn kernels", 200, "g", V), i("Onion", 1, "piece", V), i("Milk", 300, "ml", E), olive(1), water(1000), pepper],
    ["Heat the oil. Cook the onion 3 minutes.", "Add the potato and water. Simmer 10 minutes.", "Add the fish and corn. Simmer 6 minutes.", "Stir in the milk and pepper. Heat gently 2 minutes and serve."],
    "Milk instead of cream, and no salt.", FISH, ["Fish", "Milk"])),
];

export const lambMore: Recipe[] = [
  BR(T("R-LB-006", "Lamb stew with carrots and potatoes", "Western", "protein", 20, 80, 0, ["Heavy pot with lid"],
    [i("Lamb shoulder", 800, "g", M, "cubes, fat trimmed"), i("Carrots", 3, "piece", V), i("Potatoes", 500, "g", V), i("Onion", 2, "piece", V), i("Garlic", 3, "piece", V), i("Fresh rosemary", 5, "g", V), olive(1), water(900)],
    ["Heat the oil. Brown the lamb in two batches, 5 minutes each. Remove.", "Cook the onion and garlic 3 minutes. Return the lamb. Add rosemary and water.", "Cover and simmer 50 minutes. Add the carrot and potato.", "Simmer 25 minutes more until very tender. Serve."],
    "Slow cooking makes lamb soft. Trim the fat. No salt.", LAMB)),
  BR(T("R-LB-007", "Braised lamb with white radish", "Chinese", "protein", 20, 75, 0, ["Heavy pot with lid"],
    [i("Lamb shoulder", 800, "g", M, "cubes, fat trimmed"), i("White radish", 600, "g", V, "chunks"), i("Ginger", 40, "g", V, "sliced"), i("Spring onion", 4, "piece", V), i("Shaoxing wine", 2, "tbsp", P), i("Light soy sauce (low salt)", 1, "tbsp", P), water(800)],
    ["Boil the lamb 5 minutes with half the ginger. Drain and rinse (this removes the strong smell).", "Put the lamb, rest of the ginger, spring onion, wine, soy sauce and water in a pot. Boil, cover and simmer 45 minutes.", "Add the radish. Simmer 25 minutes more until very soft.", "Serve."],
    "Ginger and radish take away the strong lamb taste. Wine is cooked for over an hour.", LAMB, ["Soy"])),
  BR(T("R-LB-008", "Roast lamb leg with rosemary and garlic", "Western", "protein", 15, 90, 0, ["Roasting tin", "Oven"],
    [i("Lamb leg", 1400, "g", M, "bone-in, fat trimmed"), i("Garlic", 6, "piece", V, "sliced"), i("Fresh rosemary", 10, "g", V), olive(1), i("Lemon", 1, "piece", F, "juiced"), i("Pumpkin", 600, "g", V, "chunks"), i("Carrots", 3, "piece", V)],
    ["Heat the oven to 200°C. Cut slits in the lamb and push in the garlic and rosemary.", "Rub with oil and lemon juice. Roast 20 minutes.", "Lower to 160°C. Add the pumpkin and carrot around it. Roast 60 minutes more.", "Rest 15 minutes. Slice thin and serve."],
    "Eat a thin slice with plenty of roast vegetables. No salt.", LAMB)),
  BR(T("R-LB-009", "Lamb shepherd's pie", "Western", "protein", 25, 40, 0, ["Pan", ...dish],
    [i("Minced lamb", 500, "g", M), i("Sweet potato", 800, "g", V, "chunks"), i("Carrots", 2, "piece", V, "diced"), i("Green peas", 100, "g", V), i("Onion", 1, "piece", V), i("Tomato paste", 2, "tbsp", P), olive(1), water(250)],
    ["Boil the sweet potato 15 minutes. Mash.", "Heat the oil. Cook the onion and lamb 8 minutes. Add carrot, peas, tomato paste and water. Simmer 12 minutes.", "Put the lamb in a dish. Cover with mash.", "Bake at 200°C for 15 minutes. Serve."],
    "Soft and easy to chew.", LAMB)),
  BR(T("R-LB-010", "Lamb and vegetable soup", "Western", "soup", 15, 70, 0, pot,
    [i("Lamb shoulder", 500, "g", M, "cubes, fat trimmed"), i("White radish", 400, "g", V), i("Carrots", 2, "piece", V), i("Ginger", 30, "g", V, "sliced"), i("Spring onion", 3, "piece", V), water(2200)],
    ["Boil the lamb 5 minutes with half the ginger. Drain and rinse.", "Put everything in a pot with fresh water. Bring to the boil.", "Simmer 60 minutes until very tender.", "Serve."],
    SOUP2, LAMB)),
];

export const mexMore: Recipe[] = [
  BR(T("R-MX-005", "Fish tacos with cabbage slaw", "Mexican", "wrap", 15, 10, 0, ["Pan"],
    [i("White fish", 500, "g", S, "strips"), wraps(8), i("Cabbage", 300, "g", V, "shredded"), i("Carrots", 1, "piece", V, "grated"), i("Mild chilli powder", 1, "tsp", P), oil(1), i("Plain yoghurt", 100, "g", E), i("Lime", 2, "piece", F, "juiced")],
    ["Coat the fish with the chilli powder. Cook in the oil 4 minutes, turning, until it flakes.", "Mix the cabbage, carrot, yoghurt and lime juice.", "Warm the wraps. Fill with fish and slaw."],
    "Soft tortillas, not fried shells.", FISH, ["Fish", "Gluten", "Milk"])),
  BR(T("R-MX-006", "Chicken fajita wraps", "Mexican", "wrap", 12, 12, 0, ["Large pan"],
    [i("Chicken breast", 500, "g", M, "strips"), wraps(8), i("Capsicum", 3, "piece", V, "strips"), i("Onion", 2, "piece", V, "strips"), i("Cumin", 1, "tsp", P), i("Paprika", 1, "tsp", P), oil(1), i("Lime", 2, "piece", F)],
    ["Mix the chicken with the cumin, paprika and half the lime juice.", "Heat the oil. Cook the chicken 6 minutes. Add the capsicum and onion 5 minutes.", "Warm the wraps. Fill and add the rest of the lime juice."],
    "Spices replace salt.", POULTRY, ["Gluten"])),
  BR(T("R-MX-007", "Tuna burrito bowl", "Mexican", "wrap", 12, 5, 0, ["Bowl"],
    [i("Canned tuna", 300, "g", S, "in water, drained"), i("Cooked rice", 1200, "g", P), beans(250), i("Sweet corn kernels", 200, "g", V), i("Tomatoes", 3, "piece", V, "diced"), i("Cucumber", 1, "piece", V, "diced"), i("Avocado", 1, "piece", F, "diced"), i("Lime", 2, "piece", F)],
    ["Warm the rice.", "Mix the tomato, cucumber, avocado and lime juice.", "Fill bowls: rice, beans, corn, tuna and the fresh topping."],
    "No cooking apart from the rice. Tuna in water, beans rinsed.", FISH, ["Fish"])),
  BR(T("R-MX-008", "Egg and bean quesadilla", "Mexican", "wrap", 8, 12, 0, ["Large non-stick pan"],
    [i("Eggs", 5, "piece", E), wraps(8), beans(200), i("Spinach", 100, "g", V), i("Grated cheese", 80, "g", E), oil(1)],
    ["Scramble the eggs in the oil until just set. Mix with the beans and spinach.", "Spread on half of each wrap with a little cheese. Fold.", "Cook in a dry pan 2 minutes each side. Cut and serve."],
    "Meat-free protein.", EGGS, ["Egg", "Gluten", "Milk"])),
  BR(T("R-MX-009", "Black bean soup", "Mexican", "soup", 10, 30, 0, pot,
    [beans(500), i("Onion", 1, "piece", V), i("Carrots", 2, "piece", V), i("Garlic", 3, "piece", V), i("Cumin", 1, "tsp", P), i("Tomatoes", 3, "piece", V), oil(1), water(1500), i("Lime", 1, "piece", F)],
    ["Heat the oil. Cook the onion, carrot and garlic 5 minutes. Add the cumin.", "Add the beans, tomato and water. Simmer 20 minutes.", "Mash half the beans for a thick soup. Add lime juice. Serve."],
    "Rinse canned beans to cut salt. No salt added.")),
  BR(T("R-MX-010", "Chicken tortilla-style soup", "Mexican", "soup", 12, 30, 0, pot,
    [i("Chicken breast", 400, "g", M), i("Tomatoes", 4, "piece", V), i("Onion", 1, "piece", V), i("Sweet corn kernels", 200, "g", V), i("Capsicum", 1, "piece", V), i("Cumin", 1, "tsp", P), wraps(2), water(1800), i("Lime", 1, "piece", F)],
    ["Boil the chicken, onion, tomato, cumin and water 20 minutes. Take out the chicken and shred it.", "Add the corn and capsicum. Simmer 6 minutes.", "Toast the wraps in a dry pan until crisp. Cut in strips.", "Serve the soup with chicken, strips and lime juice."],
    "Toasted wrap strips add crunch with no frying.", POULTRY, ["Gluten"])),
  BR(T("R-MX-015", "Sweet potato and bean burrito", "Mexican", "wrap", 12, 25, 0, ["Pot", "Pan"],
    [i("Sweet potato", 600, "g", V, "small cubes"), beans(250), wraps(8), i("Spinach", 100, "g", V), i("Cumin", 1, "tsp", P), oil(1), i("Lime", 1, "piece", F)],
    ["Boil or steam the sweet potato 12 minutes until soft.", "Heat the oil. Mix in the beans, cumin and spinach. Add the sweet potato. Mash lightly.", "Warm the wraps. Fill and fold into burritos."],
    "Meat-free, soft and filling.", undefined, ["Gluten"])),
];

export const piesMore: Recipe[] = [
  BR(T("R-PI-006", "Pork and carrot pie", "Western", "pie", 15, 30, 0, ["Pan", ...dish],
    [i("Minced pork", 400, "g", M), i("Carrots", 3, "piece", V, "diced"), i("Onion", 1, "piece", V), i("Green peas", 100, "g", V), i("Cornflour", 1, "tbsp", P), water(250), olive(1), sheet, eggwash],
    ["Heat the oven to 200°C.", "Heat the oil. Cook the onion and pork 8 minutes. Add carrot, peas and water. Simmer 10 minutes. Stir in the cornflour (mixed with 1 tbsp water).", "Put in a dish. Cover with pastry. Cut slits. Brush with egg.", "Bake 20 minutes until golden."],
    "Pastry on top only." + PASTRY, PORK, ["Egg", "Gluten"])),
  BR(T("R-PI-007", "Mushroom and spinach pie", "Western", "pie", 12, 25, 0, dish,
    [i("Mushrooms", 400, "g", V, "sliced"), i("Spinach", 300, "g", V), i("Onion", 1, "piece", V), i("Eggs", 3, "piece", E), i("Plain yoghurt", 100, "g", E), olive(1), sheet],
    ["Heat the oven to 200°C. Line a dish with pastry.", "Cook the onion and mushrooms in the oil 6 minutes. Add the spinach until wilted. Squeeze out the water.", "Mix with 3 beaten eggs and the yoghurt. Pour into the dish.", "Bake 25 minutes until set and golden."],
    "Meat-free. No cheese or salt." + PASTRY, EGGS, ["Egg", "Milk", "Gluten"])),
  BR(T("R-PS-006", "Pumpkin pie", "Western", "pie", 15, 40, 0, ["Pot", ...dish],
    [i("Pumpkin", 700, "g", V, "cubed"), i("Eggs", 2, "piece", E), i("Milk", 150, "ml", E), i("Cinnamon", 1, "tsp", P), i("Honey", 1, "tbsp", P), sheet],
    ["Heat the oven to 190°C. Line a dish with pastry.", "Steam the pumpkin 15 minutes. Mash.", "Mix with the eggs, milk, cinnamon and honey. Pour in.", "Bake 35 to 40 minutes until set."],
    "Only 1 tbsp honey for 8 portions; pumpkin is naturally sweet. A treat: small slice." + PASTRY, EGGS, ["Egg", "Milk", "Gluten"]), { sweet: true }),
  BR(T("R-PS-007", "Pineapple jam pie", "Western", "pie", 12, 45, 0, ["Pot", ...dish],
    [i("Pineapple", 700, "g", F, "grated"), i("Cinnamon", 1, "piece", P, "stick"), i("Cloves", 2, "piece", P), sheet, eggwash],
    ["Cook the pineapple, cinnamon and cloves on low heat 25 minutes, stirring, until thick and jammy. Remove the spices. Cool.", "Heat the oven to 190°C. Line a dish with half the pastry; spread the jam.", "Top with strips of the rest of the pastry. Brush with egg.", "Bake 20 minutes until golden."],
    "Pineapple tarts usually have lots of sugar. This jam uses none.", undefined, ["Egg", "Gluten"]), { sweet: true }),
];

export const saladsMore: Recipe[] = [
  BR(T("R-SA-009", "Greek-style salad with chickpeas", "Western", "salad", 12, 0, 0, ["Bowl"],
    [i("Cucumber", 2, "piece", V), i("Tomatoes", 4, "piece", V), i("Chickpeas", 300, "g", P, "canned, rinsed well"), i("Red onion", 1, "piece", V, "thin slices"), i("Grated cheese", 60, "g", E, "feta-style, crumbled"), olive(2), i("Lemon", 1, "piece", F, "juiced"), herbs],
    ["Cut the cucumber and tomato into chunks.", "Mix everything in a bowl.", "Add the oil, lemon juice and herbs. Toss."],
    "Cheese is salty: only 60 g for 8 people, and no added salt.", RAW, ["Milk"])),
  BR(T("R-SA-010", "Cold sesame noodle salad", "Chinese", "salad", 15, 10, 0, ["Pot", "Bowl"],
    [i("Egg noodles", 400, "g", P), i("Cucumber", 2, "piece", V, "strips"), i("Carrots", 2, "piece", V, "shredded"), i("Chicken breast", 300, "g", M), i("Sesame seeds", 2, "tbsp", P), i("Sesame oil", 2, "tsp", P), i("Rice vinegar", 2, "tbsp", P), i("Light soy sauce (low salt)", 1, "tbsp", P)],
    ["Poach the chicken 12 minutes. Cool and shred.", "Cook the noodles in plain water. Rinse under cold water and drain.", "Mix the sesame oil, vinegar and soy sauce.", "Toss everything. Top with sesame seeds."],
    "A complete cold meal. Low-salt soy sauce, no sugar.", POULTRY + " " + RAW, ["Gluten", "Sesame", "Soy"]), { meal: "noodles" }),
  BR(T("R-SA-011", "Beef and tomato salad", "Western", "salad", 15, 8, 0, ["Pan"],
    [i("Beef sirloin", 400, "g", M), i("Tomatoes", 4, "piece", V, "wedges"), i("Cucumber", 1, "piece", V), i("Lettuce", 1, "piece", V), i("Red onion", 1, "piece", V, "thin slices"), olive(2), i("Lemon", 1, "piece", F, "juiced"), pepper],
    ["Rub the beef with pepper. Cook in a hot pan 3 to 4 minutes each side until cooked through. Rest 5 minutes, slice very thin.", "Toss the vegetables with the oil and lemon juice.", "Top with the beef."],
    "Thin slices keep the beef soft. No salt.", BEEF + " " + RAW)),
  BR(T("R-SA-012", "Roast pumpkin salad", "Western", "salad", 12, 25, 0, tray,
    [i("Pumpkin", 600, "g", V, "chunks"), i("Spinach", 150, "g", V), i("Chickpeas", 250, "g", P, "canned, rinsed"), olive(2), i("Lemon", 1, "piece", F, "juiced"), i("Cumin", 1, "tsp", P)],
    ["Heat the oven to 220°C. Roast the pumpkin with 1 tbsp oil and the cumin for 25 minutes.", "Mix the spinach and chickpeas.", "Add the warm pumpkin, the rest of the oil and the lemon juice."],
    "Warm salad, soft pumpkin. No salt.", undefined)),
];

export const moreWestern: Recipe[] = [...westMore, ...westSoupsMore, ...lambMore, ...mexMore, ...piesMore, ...saladsMore];
void SHELLFISH; void PORK; void oil; void water; void E;
