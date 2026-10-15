import { i, T, BR, POULTRY, RAW, SHELLFISH } from "./recipe-kit";
import type { Recipe } from "./types";

/** RECIPE BOOK — salads. No cooking or a short cook; each takes 30 minutes or less. Dressings use lemon, vinegar and yoghurt instead of salt and sugar. Original drafts, NOT yet taste-tested. For 8 people. */
const V = "Vegetables" as const, P = "Pantry" as const, M = "Meat" as const, S = "Seafood" as const, E = "Eggs & dairy" as const, F = "Fruit" as const;
const lemon = i("Lemon", 1, "piece", F, "juiced");
const olive = (n: number) => i("Olive oil", n, "tbsp", P);

export const salads: Recipe[] = [
  BR(T("R-SA-001", "Sesame chicken and cucumber salad", "Chinese", "salad", 12, 12, 0, ["Pot"],
    [i("Chicken breast", 500, "g", M), i("Cucumber", 3, "piece", V, "thin strips"), i("Carrots", 2, "piece", V, "shredded"), i("Lettuce", 1, "piece", V, "torn"), i("Sesame seeds", 2, "tbsp", P), i("Rice vinegar", 2, "tbsp", P), i("Sesame oil", 2, "tsp", P), i("Light soy sauce (low salt)", 1, "tbsp", P)],
    ["Poach the chicken in simmering water 12 minutes. Check no pink. Cool and shred.", "Mix the vinegar, sesame oil and soy sauce.", "Toss the chicken, cucumber, carrot and lettuce with the dressing. Top with sesame seeds."],
    "Light dressing with 1 tbsp low-salt soy sauce for 8.", POULTRY + " " + RAW, ["Sesame", "Soy"])),
  BR(T("R-SA-002", "Tuna and white bean salad", "Western", "salad", 10, 0, 0, ["Bowl"],
    [i("Canned tuna", 300, "g", S, "in water, drained"), i("White beans", 400, "g", P, "canned, rinsed well"), i("Cherry tomatoes", 250, "g", V, "halved"), i("Cucumber", 1, "piece", V, "diced"), i("Red onion", 1, "piece", V, "thin slices"), olive(2), lemon],
    ["Rinse the beans well under water.", "Mix everything in a bowl.", "Add the oil and lemon juice. Toss and serve."],
    "Rinsing the beans and choosing tuna in water keeps the salt low. No added salt.", RAW, ["Fish"])),
  BR(T("R-SA-003", "Prawn and mango salad", "Western", "salad", 12, 5, 0, ["Pot"],
    [i("Prawns, peeled", 500, "g", S), i("Mango", 2, "piece", F, "diced"), i("Lettuce", 1, "piece", V, "torn"), i("Cucumber", 1, "piece", V, "sliced"), i("Fresh mint", 10, "g", V, "chopped"), i("Lime", 2, "piece", F, "juiced"), olive(1)],
    ["Boil the prawns 3 to 4 minutes until pink. Cool in cold water.", "Mix the lettuce, cucumber, mango and mint.", "Add the prawns. Toss with the lime juice and oil."],
    "Mango gives the sweetness. No sugar or fish sauce.", SHELLFISH + " " + RAW, ["Shellfish"])),
  BR(T("R-SA-004", "Egg and potato salad", "Western", "salad", 8, 20, 0, ["Pot"],
    [i("Potatoes", 700, "g", V, "cubed"), i("Eggs", 6, "piece", E), i("Plain yoghurt", 100, "g", E), i("Spring onion", 3, "piece", V, "chopped"), i("Celery", 100, "g", V, "diced"), i("Black pepper", 0.25, "tsp", P), lemon],
    ["Boil the eggs 9 minutes. Cool and peel.", "Boil the potato in a second pot 12 minutes. Drain and cool a little.", "Mix the yoghurt, lemon juice and pepper. Toss with the potato, chopped eggs, celery and spring onion."],
    "Yoghurt replaces mayonnaise: much less fat and salt. Soft for the seniors.", RAW, ["Egg", "Milk"])),
  BR(T("R-SA-005", "Tofu and tomato salad", "Chinese", "salad", 10, 0, 0, ["Bowl"],
    [i("Soft tofu", 600, "g", P, "cut in cubes"), i("Tomatoes", 4, "piece", V, "wedges"), i("Spring onion", 3, "piece", V, "chopped"), i("Sesame oil", 2, "tsp", P), i("Light soy sauce (low salt)", 1, "tbsp", P), i("Sesame seeds", 1, "tbsp", P)],
    ["Lay the tofu and tomato on a plate.", "Mix the sesame oil and soy sauce. Pour over.", "Top with spring onion and sesame seeds."],
    "Silky tofu needs no cooking. Very soft for the seniors.", RAW, ["Soy", "Sesame"])),
  BR(T("R-SA-006", "Cold cucumber salad", "Chinese", "salad", 10, 0, 0, ["Bowl"],
    [i("Cucumber", 4, "piece", V, "smashed and cut in pieces"), i("Garlic", 3, "piece", V, "minced"), i("Rice vinegar", 2, "tbsp", P), i("Sesame oil", 2, "tsp", P), i("Light soy sauce (low salt)", 1, "tbsp", P)],
    ["Smash the cucumbers with the flat of a knife. Cut in pieces.", "Mix the garlic, vinegar, sesame oil and soy sauce.", "Toss with the cucumber. Chill 10 minutes if you can. Serve."],
    "Crunchy and fresh. Low-salt soy sauce, no sugar.", RAW, ["Soy", "Sesame"])),
  BR(T("R-SA-007", "Chickpea and vegetable salad", "Western", "salad", 12, 0, 0, ["Bowl"],
    [i("Chickpeas", 400, "g", P, "canned, rinsed well"), i("Cucumber", 2, "piece", V, "diced"), i("Tomatoes", 3, "piece", V, "diced"), i("Capsicum", 1, "piece", V, "diced"), i("Fresh parsley", 15, "g", V, "chopped"), olive(2), lemon, i("Cumin", 0.5, "tsp", P)],
    ["Rinse the chickpeas well.", "Mix all the vegetables, chickpeas and parsley.", "Add the oil, lemon juice and cumin. Toss and serve."],
    "Plant protein and fibre. No added salt.", RAW)),
  BR(T("R-SA-008", "Crunchy cabbage and carrot slaw", "Western", "salad", 12, 0, 0, ["Bowl"],
    [i("Cabbage", 500, "g", V, "finely shredded"), i("Carrots", 3, "piece", V, "grated"), i("Apples", 2, "piece", F, "thin strips"), i("Plain yoghurt", 120, "g", E), lemon, i("Black pepper", 0.25, "tsp", P)],
    ["Mix the yoghurt, lemon juice and pepper.", "Toss the cabbage, carrot and apple with the dressing.", "Chill and serve."],
    "Apple gives sweetness, yoghurt replaces mayonnaise. No sugar or salt.", RAW, ["Milk"])),
];
