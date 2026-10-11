import type { Ingredient, Recipe } from "./types";

/**
 * ROUGH ESTIMATES of Singapore supermarket prices (NTUC / Sheng Siong style), in S$.
 * They are NOT live prices and were not copied from a store. Only eggs were
 * checked (about S$5–7.50 for 30 eggs, so ~S$0.20 each). Everything else is a
 * sensible guess. Replace with the family's real receipts when available.
 * Rules are checked top to bottom: the first match wins.
 */
interface Rule { re: RegExp; kg?: number; l?: number; each?: number; tsp?: number }

export const PRICE_RULES: Rule[] = [
  // proteins
  { re: /salmon/i, kg: 36 }, { re: /cod/i, kg: 38 }, { re: /sea bass|mackerel/i, kg: 18 },
  { re: /white fish/i, kg: 22 }, { re: /prawn/i, kg: 28 }, { re: /canned tuna/i, kg: 14 },
  { re: /beef/i, kg: 28 }, { re: /pork ribs/i, kg: 14 }, { re: /pork/i, kg: 11 },
  { re: /whole chicken/i, kg: 6.5 }, { re: /chicken breast/i, kg: 8 }, { re: /chicken|drumstick/i, kg: 7.5 },
  { re: /^eggs?$|hard-boiled/i, each: 0.2 },
  { re: /silken|soft tofu/i, kg: 4.5 }, { re: /tofu/i, kg: 5 }, { re: /tempeh/i, kg: 8 },
  { re: /cheese/i, each: 0.35 }, { re: /yoghurt/i, kg: 6 }, { re: /milk/i, l: 3 }, { re: /coconut milk/i, l: 6 },
  // vegetables
  { re: /ginger|galangal/i, kg: 4 }, { re: /garlic$/i, each: 0.15 }, { re: /garlic powder/i, tsp: 0.06 },
  { re: /lemongrass/i, each: 0.4 }, { re: /spring onion/i, each: 0.25 }, { re: /shallot/i, each: 0.2 },
  { re: /^onion/i, each: 0.5 }, { re: /chilli|chili/i, each: 0.2 }, { re: /kaffir|pandan leaves|celery leaves/i, each: 0.1 },
  { re: /coriander|parsley|thai basil|mint/i, kg: 20, each: 0.8 },
  { re: /tomato paste/i, tsp: 0.08 }, { re: /canned tomatoes/i, kg: 4 }, { re: /cherry tomato/i, kg: 8 },
  { re: /tomato/i, each: 0.45 }, { re: /carrot/i, kg: 2.2, each: 0.4 }, { re: /capsicum/i, each: 1.2 },
  { re: /cucumber/i, each: 0.7, kg: 2.5 }, { re: /sweet corn kernels/i, kg: 5 }, { re: /sweet corn/i, each: 1 },
  { re: /baby corn/i, kg: 8 }, { re: /potato/i, kg: 2.8 }, { re: /sweet potato/i, kg: 3 },
  { re: /pumpkin/i, kg: 2.5 }, { re: /yam/i, kg: 4 }, { re: /tapioca \(/i, kg: 3 },
  { re: /winter melon|old cucumber|chayote|green papaya/i, kg: 2.5 },
  { re: /cabbage/i, kg: 2.8 }, { re: /bok choy|choy sum|kailan|yin choy|spinach|kangkong|water spinach/i, kg: 4.5 },
  { re: /watercress/i, kg: 9 }, { re: /broccoli|cauliflower/i, kg: 6 }, { re: /bean sprout/i, kg: 2.5 },
  { re: /chives/i, kg: 9 }, { re: /celery/i, kg: 6 }, { re: /eggplant|zucchini|courgette|okra|long beans|green beans/i, kg: 5 },
  { re: /edamame/i, kg: 10 }, { re: /green peas/i, kg: 5 }, { re: /lotus root/i, kg: 7 },
  { re: /enoki/i, kg: 10 }, { re: /mushroom/i, kg: 9 }, { re: /radish/i, kg: 2.5 }, { re: /water chestnut/i, each: 0.35 },
  { re: /dried shiitake/i, each: 0.5 }, { re: /wood ear/i, kg: 60 }, { re: /wakame/i, kg: 80 },
  // fruit
  { re: /banana/i, each: 0.3 }, { re: /apple|pear|orange/i, each: 0.8 }, { re: /papaya/i, each: 3.5 },
  { re: /mango/i, each: 1.8 }, { re: /lemon/i, each: 0.9 }, { re: /lime/i, each: 0.4 },
  { re: /raisin/i, kg: 12 }, { re: /red dates|dates|figs|goji|scallops|octopus/i, each: 0.4, kg: 30 },
  // pantry
  { re: /rice flour|tapioca flour|glutinous/i, kg: 3.5 }, { re: /wholemeal flour|plain flour/i, kg: 2.5 },
  { re: /breadcrumb/i, kg: 6 }, { re: /semolina/i, kg: 4 }, { re: /rolled oats/i, kg: 5 },
  { re: /basmati/i, kg: 5.5 }, { re: /jasmine|^rice$|cooked rice/i, kg: 2.6 },
  { re: /glass noodles/i, kg: 9 }, { re: /mung beans|red lentils/i, kg: 5 },
  { re: /chickpeas|white beans/i, kg: 4 }, { re: /wholemeal bread/i, each: 0.13 }, { re: /wraps/i, each: 0.6 },
  { re: /rock sugar/i, kg: 5 }, { re: /cornflour/i, tsp: 0.02 }, { re: /baking powder|yeast/i, tsp: 0.06 },
  { re: /cooking oil/i, l: 5 }, { re: /olive oil/i, l: 14 }, { re: /sesame oil/i, l: 22 },
  { re: /soy sauce|kecap/i, l: 6 }, { re: /oyster sauce|fish sauce/i, l: 9 }, { re: /mirin|shaoxing|vinegar/i, l: 9 },
  { re: /miso/i, l: 14 }, { re: /tamarind/i, l: 8 }, { re: /sesame seeds/i, tsp: 0.06 },
  { re: /fried shallots/i, tsp: 0.08 }, { re: /grated coconut/i, kg: 7 }, { re: /pandan juice/i, l: 3 },
  { re: /^water$|warm water|cold water/i, l: 0 },
  { re: /wrappers/i, each: 0.12 }, { re: /puff pastry|curry puff pastry/i, each: 0.25 },
  { re: /spaghetti/i, kg: 3.5 }, { re: /mee sua/i, kg: 6 }, { re: /udon|soba/i, kg: 5 }, { re: /noodles|vermicelli|bee hoon/i, kg: 4.5 }, { re: /lettuce/i, each: 1.5 }, { re: /snow peas/i, kg: 9 },
  { re: /chicken wings/i, kg: 7 }, { re: /asparagus/i, kg: 12 }, { re: /taro/i, kg: 4 }, { re: /peanuts/i, kg: 8 },
  { re: /salt$/i, tsp: 0.005 },
  { re: /pepper|paprika|cumin|turmeric|cinnamon|nutmeg|coriander|masala|curry|chilli powder|mustard|thyme|rosemary|oregano|basil|herbs|dill|star anise|peppercorn/i, tsp: 0.12, each: 0.1 },
];

const CATEGORY_KG: Record<string, number> = { Vegetables: 4, Fruit: 4, Meat: 10, Seafood: 22, "Eggs & dairy": 6, Pantry: 6, Other: 4 };

export function ingredientCost(ing: Ingredient): number {
  const rule = PRICE_RULES.find((r) => r.re.test(ing.name));
  const q = ing.qty;
  if (!rule) {
    const kg = CATEGORY_KG[ing.category] ?? 5;
    if (ing.unit === "g") return (q / 1000) * kg;
    if (ing.unit === "kg") return q * kg;
    if (ing.unit === "ml") return (q / 1000) * kg;
    if (ing.unit === "l") return q * kg;
    if (ing.unit === "piece") return q * 0.4;
    return q * 0.1;
  }
  const perTsp = rule.tsp ?? (rule.l !== undefined ? rule.l * 0.005 : 0.08);
  switch (ing.unit) {
    case "g": return (q / 1000) * (rule.kg ?? (rule.l ?? 5));
    case "kg": return q * (rule.kg ?? (rule.l ?? 5));
    case "ml": return (q / 1000) * (rule.l ?? rule.kg ?? 5);
    case "l": return q * (rule.l ?? rule.kg ?? 5);
    case "tsp": return q * perTsp;
    case "tbsp": return q * 3 * perTsp;
    case "piece": return q * (rule.each ?? 0.4);
  }
}

/** Estimated cost for 8 people, rounded to the nearest 10 cents. Returns undefined if there is no ingredient list. */
export function estimateRecipeCost(r: Recipe): number | undefined {
  if (!r.ingredients || r.ingredients.length === 0) return undefined;
  const total = r.ingredients.reduce((s, g) => s + ingredientCost(g), 0);
  return Math.max(0.5, Math.round(total * 10) / 10);
}
