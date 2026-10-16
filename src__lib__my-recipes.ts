import type { Category, Cuisine, DishClass, Ingredient, Recipe } from "./types";
import { estimateRecipeCost } from "./prices";

/** Helpers for recipes the family types in or pastes in themselves. Everything here is plain code (no screen), so it can be tested. */

export const MY_PREFIX = "R-MY-";
export const isMine = (r: { recipe_id: string }): boolean => r.recipe_id.startsWith(MY_PREFIX);

export const SERVES_OPTIONS = [1, 2, 4, 6, 8, 10, 12];

export const CUISINE_CHOICES: { id: string; label: string; cuisine: Cuisine; region?: Recipe["region"] }[] = [
  { id: "chinese", label: "Chinese (any)", cuisine: "Chinese" },
  { id: "cantonese", label: "Cantonese", cuisine: "Chinese", region: "Cantonese" },
  { id: "teochew", label: "Teochew", cuisine: "Chinese", region: "Teochew" },
  { id: "hokkien", label: "Hokkien", cuisine: "Chinese", region: "Hokkien" },
  { id: "hakka", label: "Hakka", cuisine: "Chinese", region: "Hakka" },
  { id: "western", label: "Western", cuisine: "Western" },
  { id: "mexican", label: "Mexican-style", cuisine: "Mexican" },
  { id: "japanese", label: "Japanese", cuisine: "Japanese" },
  { id: "korean", label: "Korean", cuisine: "Korean" },
  { id: "thai", label: "Thai", cuisine: "Thai" },
  { id: "malay", label: "Malay / Indonesian", cuisine: "Malaysian" },
  { id: "other", label: "Other / Fusion", cuisine: "Fusion" },
];

export const TYPE_CHOICES: { id: string; label: string; cls: DishClass }[] = [
  { id: "protein", label: "Meat, fish, egg or tofu dish", cls: "protein" },
  { id: "vegetable", label: "Vegetable dish", cls: "vegetable" },
  { id: "soup", label: "Soup", cls: "soup" },
  { id: "onedish", label: "Rice, noodle or one-dish meal", cls: "onedish" },
  { id: "wrap", label: "Wrap, bowl or quesadilla", cls: "wrap" },
  { id: "pie", label: "Pie or tart", cls: "pie" },
  { id: "salad", label: "Salad", cls: "salad" },
];

// ---------- ingredient lines ----------
const FRACTIONS: Record<string, number> = { "½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3, "⅛": 0.125 };

const UNITS: [RegExp, Ingredient["unit"], number][] = [
  [/^(kg|kilograms?|kilos?)\b/i, "kg", 1],
  [/^(g|grams?|gm)\b/i, "g", 1],
  [/^(ml|millilitres?|milliliters?)\b/i, "ml", 1],
  [/^(l|litres?|liters?)\b/i, "l", 1],
  [/^(tbsps?|tablespoons?|tbs|tbl)\b/i, "tbsp", 1],
  [/^(tsps?|teaspoons?)\b/i, "tsp", 1],
  [/^(cups?)\b/i, "ml", 240],
  [/^(oz|ounces?)\b/i, "g", 28],
  [/^(lbs?|pounds?)\b/i, "g", 454],
  [/^(pinch(es)?|dash(es)?)\b/i, "tsp", 0.25],
  [/^(cloves?|slices?|stalks?|sprigs?|cans?|tins?|pieces?|pcs?|bunch(es)?|heads?|sticks?|sheets?|fillets?)\b/i, "piece", 1],
];

const WORDS: Record<string, string[]> = {
  Meat: ["chicken", "pork", "beef", "lamb", "duck", "mince", "sausage", "ham", "bacon", "turkey", "mutton", "ribs", "veal"],
  Seafood: ["fish", "prawn", "shrimp", "squid", "crab", "clam", "mussel", "salmon", "cod", "tuna", "scallop", "oyster", "pomfret", "mackerel", "anchov", "sardine", "seabass", "snapper", "fillet"],
  "Eggs & dairy": ["egg", "milk", "cheese", "butter", "yoghurt", "yogurt", "cream", "parmesan", "mozzarella", "cheddar", "paneer"],
  Fruit: ["apple", "lemon", "lime", "orange", "mango", "pineapple", "banana", "berry", "berries", "pear", "grape", "papaya", "melon", "raisin", "peach", "avocado"],
  Vegetables: ["onion", "garlic", "ginger", "carrot", "cabbage", "tomato", "potato", "spinach", "broccoli", "mushroom", "cucumber", "lettuce", "pak choy", "bok choy", "choy sum", "celery", "pumpkin", "corn", "capsicum", "pepper", "chilli", "chili", "beans", "peas", "sprout", "kale", "leek", "eggplant", "aubergine", "brinjal", "zucchini", "courgette", "radish", "daikon", "spring onion", "scallion", "coriander", "cilantro", "basil", "parsley", "mint", "herb", "lady", "okra", "kangkong", "cauliflower", "squash", "yam", "taro", "sweet potato", "beetroot", "turnip", "asparagus"],
};

export function guessCategory(name: string): Category {
  const n = name.toLowerCase();
  // fruit juice and "pepper" as a spice should not be vegetables: check pantry words first
  if (/\b(black pepper|white pepper|pepper powder|ground pepper|peppercorn|ground ginger|chilli powder|chili powder|oil|sauce|vinegar|flour|sugar|salt|stock|broth|wine|noodles?|rice|pasta|bread|spice|powder|paste|cornflour|starch|honey|syrup|oats|lentils?|chickpeas?|tofu|bean curd|nuts?|seeds?|wrap|tortilla|crumbs)\b/.test(n) && !/\b(fish sauce)\b/.test(n)) return "Pantry";
  for (const cat of ["Seafood", "Meat", "Eggs & dairy", "Fruit", "Vegetables"] as const) {
    if (WORDS[cat].some((w) => n.includes(w))) return cat;
  }
  return "Other";
}

function toNumber(tok: string): number | undefined {
  if (/^\d+$/.test(tok)) return Number(tok);
  if (/^\d*\.\d+$/.test(tok)) return Number(tok);
  const m = tok.match(/^(\d+)\/(\d+)$/);
  if (m && Number(m[2]) !== 0) return Number(m[1]) / Number(m[2]);
  if (FRACTIONS[tok] !== undefined) return FRACTIONS[tok];
  const mix = tok.match(/^(\d+)([½¼¾⅓⅔⅛])$/);
  if (mix) return Number(mix[1]) + FRACTIONS[mix[2]];
  return undefined;
}

export interface ParsedIngredient extends Ingredient { guessed?: boolean } // guessed = no amount found

/** "200 g chicken breast, sliced" -> { name: "chicken breast", qty: 200, unit: "g", prep: "sliced" }. Lines with no amount become "1 piece" and are flagged. */
export function parseIngredientLine(raw: string): ParsedIngredient | null {
  let line = raw.replace(/^[\s\-*•·●▢☐□]+/, "").replace(/\(.*?\)/g, (m) => (m.length > 40 ? "" : m)).trim();
  if (!line) return null;
  // Normalise "1 ½" and "1 1/2" into one token, and ranges "2-3" to the higher number.
  line = line.replace(/(\d)\s+([½¼¾⅓⅔⅛])/g, "$1$2").replace(/(\d+)\s+(\d+\/\d+)/, "$1+$2");
  const toks = line.split(/\s+/);
  let qty: number | undefined;
  let k = 0;
  const first = toks[0] ?? "";
  const plus = first.match(/^(\d+)\+(\d+\/\d+)$/);
  const range = first.match(/^(\d+(?:\.\d+)?)[-–](\d+(?:\.\d+)?)$/);
  if (plus) { qty = Number(plus[1]) + (toNumber(plus[2]) ?? 0); k = 1; }
  else if (range) { qty = Math.max(Number(range[1]), Number(range[2])); k = 1; }
  else {
    // "200g" or "2tbsp" stuck together
    const stuck = first.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
    if (stuck) { qty = Number(stuck[1]); toks.splice(0, 1, stuck[1], stuck[2]); k = 1; }
    else { const n = toNumber(first); if (n !== undefined) { qty = n; k = 1; } }
  }
  let unit: Ingredient["unit"] = "piece";
  let mult = 1;
  let rest = toks.slice(k).join(" ");
  if (qty !== undefined) {
    for (const [re, u, m] of UNITS) {
      const hit = rest.match(re);
      if (hit) { unit = u; mult = m; rest = rest.slice(hit[0].length).trim(); break; }
    }
    rest = rest.replace(/^of\s+/i, "");
  }
  let prep: string | undefined;
  const comma = rest.indexOf(",");
  if (comma > 0) { prep = rest.slice(comma + 1).trim() || undefined; rest = rest.slice(0, comma).trim(); }
  const name = rest.trim();
  if (!name) return null;
  const clean = name.charAt(0).toUpperCase() + name.slice(1);
  if (qty === undefined || qty <= 0) {
    return { name: clean, qty: 1, unit: "piece", prep: prep ?? (/to taste|pinch|dash/i.test(raw) ? "to taste" : undefined), category: guessCategory(name), guessed: true };
  }
  return { name: clean, qty: +(qty * mult).toFixed(3), unit, prep, category: guessCategory(name) };
}

export function parseIngredients(text: string): ParsedIngredient[] {
  return text.split(/\r?\n/).map(parseIngredientLine).filter((x): x is ParsedIngredient => !!x);
}

export function parseSteps(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(step\s*)?\d+\s*[.):\-]\s*/i, "").replace(/^[\s\-*•·●]+/, "").trim())
    .filter((l) => l.length > 0);
}

// ---------- paste a whole recipe ----------
export interface PastedRecipe { name: string; ingredients: string; steps: string; prep?: number; cook?: number; serves?: number }

const HEAD_ING = /^\s*(ingredients?|what you.?ll need|you will need)\s*:?\s*$/i;
const HEAD_STEPS = /^\s*(method|directions?|instructions?|steps?|preparation|how to (make|cook))\s*:?\s*$/i;

function minutesIn(s: string): number | undefined {
  const h = s.match(/(\d+)\s*(h|hr|hrs|hour|hours)\b/i);
  const m = s.match(/(\d+)\s*(m|min|mins|minute|minutes)\b/i);
  if (!h && !m) return undefined;
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0);
}

export function parsePasted(text: string): PastedRecipe {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const nonEmpty = lines.filter((l) => l);
  const out: PastedRecipe = { name: "", ingredients: "", steps: "" };
  let mode: "head" | "ing" | "steps" = "head";
  const ing: string[] = [];
  const steps: string[] = [];
  for (const line of lines) {
    if (!line) continue;
    if (HEAD_ING.test(line)) { mode = "ing"; continue; }
    if (HEAD_STEPS.test(line)) { mode = "steps"; continue; }
    const meta = line.match(/^(prep(?:aration)?(?: time)?|cook(?:ing)?(?: time)?|serves|servings|makes|yield)\s*:?\s*(.+)$/i);
    if (meta && mode === "head") {
      const key = meta[1].toLowerCase();
      if (key.startsWith("prep")) out.prep = minutesIn(meta[2]) ?? out.prep;
      else if (key.startsWith("cook")) out.cook = minutesIn(meta[2]) ?? out.cook;
      else { const n = meta[2].match(/\d+/); if (n) out.serves = Number(n[0]); }
      continue;
    }
    if (mode === "ing") ing.push(line);
    else if (mode === "steps") steps.push(line);
  }
  out.name = nonEmpty[0] && !HEAD_ING.test(nonEmpty[0]) && !HEAD_STEPS.test(nonEmpty[0]) ? nonEmpty[0].replace(/^#+\s*/, "") : "";
  out.ingredients = ing.join("\n");
  out.steps = steps.join("\n");
  // No headings at all? Treat lines that start with an amount as ingredients and the rest as steps.
  if (!out.ingredients && !out.steps) {
    const body = nonEmpty.slice(1);
    out.ingredients = body.filter((l) => /^[\d½¼¾⅓⅔]/.test(l) && l.length < 80).join("\n");
    out.steps = body.filter((l) => !(/^[\d½¼¾⅓⅔]/.test(l) && l.length < 80)).join("\n");
  }
  return out;
}

// ---------- build a Recipe ----------
export interface Draft {
  name: string;
  name_zh?: string;
  cuisineId: string;
  typeId: string;
  sweet?: boolean;
  prep: number;
  cook: number;
  serves: number; // how many people the typed amounts feed
  ingredients: string;
  steps: string;
  note?: string;
  source?: string;
}

export function validateDraft(d: Draft): string[] {
  const problems: string[] = [];
  if (d.name.trim().length < 2) problems.push("Please type the name of the dish.");
  if (parseIngredients(d.ingredients).length === 0) problems.push("Please type at least one ingredient (one per line).");
  if (parseSteps(d.steps).length === 0) problems.push("Please type at least one step (one per line).");
  if (!(d.serves > 0)) problems.push("Please say how many people the recipe serves.");
  return problems;
}

/** Turns the form into a Recipe. Amounts are scaled so the stored recipe is always for 8 people, like every other recipe in the app. */
export function buildRecipe(d: Draft, id: string): Recipe {
  const cc = CUISINE_CHOICES.find((c) => c.id === d.cuisineId) ?? CUISINE_CHOICES[0];
  const tc = TYPE_CHOICES.find((t) => t.id === d.typeId) ?? TYPE_CHOICES[0];
  const factor = 8 / d.serves;
  const ingredients: Ingredient[] = parseIngredients(d.ingredients).map((p) => ({ name: p.name, unit: p.unit, prep: p.prep, category: p.category, qty: +(p.qty * (p.guessed ? 1 : factor)).toFixed(3) }));
  const r: Recipe = {
    recipe_id: id,
    name: d.name.trim(),
    name_zh: d.name_zh?.trim() || undefined,
    cuisine: cc.cuisine,
    region: cc.region,
    dish_class: tc.cls,
    servings_default: 8,
    prep_time_minutes: Math.max(0, Math.round(d.prep || 0)),
    cook_time_minutes: Math.max(0, Math.round(d.cook || 0)),
    estimated_cost_sgd: 0,
    is_sample: false,
    browse: true,
    mine: true,
    sweet: tc.cls === "pie" && d.sweet ? true : undefined,
    ingredients,
    steps: parseSteps(d.steps),
    oil_salt_sugar_note: d.note?.trim() || undefined,
    source: d.source?.trim() || undefined,
  };
  r.estimated_cost_sgd = estimateRecipeCost(r) ?? 0;
  return r;
}

/** Fills the form again from a stored recipe (amounts shown for 8 people). */
export function draftFromRecipe(r: Recipe): Draft {
  const cc = CUISINE_CHOICES.find((c) => c.cuisine === r.cuisine && (c.region ?? undefined) === (r.region ?? undefined)) ?? CUISINE_CHOICES.find((c) => c.cuisine === r.cuisine) ?? CUISINE_CHOICES[0];
  const tc = TYPE_CHOICES.find((t) => t.cls === r.dish_class) ?? TYPE_CHOICES[0];
  const line = (g: Ingredient) => `${+g.qty.toFixed(2)} ${g.unit === "piece" ? "" : g.unit + " "}${g.name}${g.prep ? ", " + g.prep : ""}`.replace(/\s+/g, " ").trim();
  return {
    name: r.name, name_zh: r.name_zh, cuisineId: cc.id, typeId: tc.id, sweet: !!r.sweet,
    prep: r.prep_time_minutes, cook: r.cook_time_minutes, serves: 8,
    ingredients: (r.ingredients ?? []).map(line).join("\n"), steps: (r.steps ?? []).join("\n"),
    note: r.oil_salt_sugar_note, source: r.source,
  };
}
