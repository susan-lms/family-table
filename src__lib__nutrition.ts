import type { Ingredient, PlannedDay, Recipe } from "./types";
import { slotFactor } from "./servings";

/**
 * ROUGH protein estimate (grams) from ingredient names. Typical values per 100 g of the raw food, from general food-table knowledge.
 * It is a guide only: real amounts change with cut, bone, brand and cooking.
 */
const PER_100G: Array<[RegExp, number]> = [
  [/pork ribs/i, 14], [/chicken wings/i, 16], [/chicken breast/i, 23], [/minced chicken|chicken/i, 18],
  [/minced pork|lean pork|pork/i, 20], [/beef/i, 20], [/salmon/i, 20], [/cod|sea bass|white fish|mackerel/i, 19],
  [/canned tuna/i, 24], [/prawn/i, 18], [/squid/i, 16], [/clam/i, 10], [/scallop(?! or)/i, 17], [/mussel/i, 12],
  [/tempeh/i, 19], [/egg tofu/i, 5], [/silken/i, 5], [/soft tofu/i, 6], [/firm tofu|tofu/i, 8],
  [/wholemeal bread/i, 0], [/red lentils/i, 24], [/chickpeas|white beans/i, 7], [/edamame/i, 11], [/peanuts/i, 26], [/rolled oats/i, 13],
  [/^rice$|jasmine|basmati/i, 7], [/cooked rice/i, 2.5], [/green peas/i, 5], [/mushroom/i, 3], [/miso/i, 12],
];
const EGG_G = 6; // per egg

function toGrams(ing: Ingredient): number {
  if (ing.unit === "kg") return ing.qty * 1000;
  if (ing.unit === "g") return ing.qty;
  return 0;
}

export function ingredientProtein(ing: Ingredient): number {
  const n = ing.name.toLowerCase();
  if (/^eggs?$/.test(n)) return ing.unit === "piece" ? ing.qty * EGG_G : 0;
  if (/egg tofu/.test(n) && ing.unit === "piece") return ing.qty * 4; // one tube is about 80 g
  const rule = PER_100G.find(([re]) => re.test(n));
  if (!rule) return ing.category === "Vegetables" ? (toGrams(ing) / 100) * 1.5 : 0;
  return (toGrams(ing) / 100) * rule[1];
}

/** Protein (g) in the whole recipe, written for 8 people. */
export const recipeProtein = (r: Recipe): number => (r.ingredients ?? []).reduce((s, g) => s + ingredientProtein(g), 0);

/**
 * Protein per person for one day, in grams.
 * `both` = someone who eats lunch (4 people share it) and dinner (8 share it). `dinnerOnly` = someone who only eats dinner.
 */
export function dayProteinPerPerson(day: PlannedDay): { both: number; dinnerOnly: number } {
  const sum = (rs: Recipe[]) => rs.reduce((s, r) => s + recipeProtein(r), 0);
  const lunch = (sum(day.slots.lunch) * slotFactor("lunch")) / 4;
  const dinner = sum(day.slots.dinner) / 8;
  return { both: lunch + dinner, dinnerOnly: dinner };
}

/** Goal for the seniors: 1.0 to 1.2 g per kg body weight per day (PROT-AGE study group, people over 65). For 50 to 60 kg that is about 50 to 72 g. */
export const SENIOR_PROTEIN_GOAL = { low: 50, high: 72 };

/** Calcium-rich foods, found from ingredient names. Used for a simple tag, not for amounts. */
const CALCIUM_RE = /tofu|tempeh|kailan|bok choy|choy sum|yin choy|mustard greens|broccoli|watercress|okra|milk|yoghurt|cheese|sesame seeds|anchov|ikan bilis|sardine|napa cabbage/i;
export const isCalciumRich = (r: Recipe): boolean => (r.ingredients ?? []).some((g) => CALCIUM_RE.test(g.name));
export const CALCIUM_NOTE = "HPB suggests 1,200 mg calcium a day for women aged 50 and above, and 1,000 to 1,200 mg for men aged 50 and above. This tag only shows calcium-rich foods, not amounts. Ask a doctor if you need calcium or vitamin D supplements.";

/** Fruit after dinner: 7 low-sugar, soft choices that rotate by weekday. Quantities are for 8 people. */
export interface Fruit { name: string; zh: string; qty: number; unit: "piece" | "g"; cost: number }
export const FRUITS: Fruit[] = [
  { name: "Papaya", zh: "木瓜", qty: 1, unit: "piece", cost: 3.5 },
  { name: "Banana", zh: "香蕉", qty: 8, unit: "piece", cost: 2.4 },
  { name: "Pear", zh: "梨", qty: 4, unit: "piece", cost: 3.2 },
  { name: "Orange", zh: "橙", qty: 8, unit: "piece", cost: 5.6 },
  { name: "Apple", zh: "苹果", qty: 4, unit: "piece", cost: 3.2 },
  { name: "Guava", zh: "番石榴", qty: 4, unit: "piece", cost: 4 },
  { name: "Watermelon", zh: "西瓜", qty: 1500, unit: "g", cost: 4 },
];
export const fruitFor = (isoDate: string): Fruit => FRUITS[new Date(isoDate + "T00:00:00Z").getUTCDay() % FRUITS.length];

/** Keeps-well dishes (soups, braises, stews): the cooking page shows leftover safety tips for these. */
export const keepsWell = (r: Recipe): boolean => r.dish_class === "soup" || /braise|stew|simmer|curry|lodeh|rendang/i.test(`${r.name} ${(r.steps ?? []).join(" ")}`) && !/steam|fry/i.test(r.name);
export const LEFTOVER_TIP =
  "Leftovers: cool and put in the fridge within 2 hours, eat within 2 to 3 days, and reheat only once until piping hot. Older adults are more at risk from food poisoning, so the seniors are best served freshly cooked food (HealthXchange Singapore).";
