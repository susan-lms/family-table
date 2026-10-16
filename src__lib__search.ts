import type { Recipe } from "./types";
import { mainProtein } from "./protein";

/**
 * Smart search for the recipe book.
 * - A cuisine word (Chinese, Thai, 粤菜 ...) picks that cuisine tab.
 * - A dish-type word (soup, salad, noodles ...) picks that type.
 * - Anything left (pork, tofu, mushroom ...) must appear in the dish name or its ingredients.
 */
export interface ParsedQuery {
  cuisineId: string | null;
  typeId: string | null;
  tokens: string[];
  understood: string[]; // friendly words shown to the user
}

const CUISINE_WORDS: [string, string, string][] = [
  ["my recipes", "mine", "My recipes"], ["my recipe", "mine", "My recipes"], ["我的食谱", "mine", "My recipes"],
  // [keyword, cuisine tab id, label]
  ["chinese", "chinese", "Chinese"], ["中餐", "chinese", "Chinese"], ["中国菜", "chinese", "Chinese"],
  ["cantonese", "cantonese", "Cantonese"], ["粤菜", "cantonese", "Cantonese"], ["广东", "cantonese", "Cantonese"],
  ["teochew", "teochew", "Teochew"], ["潮州", "teochew", "Teochew"], ["潮汕", "teochew", "Teochew"],
  ["hokkien", "hokkien", "Hokkien"], ["福建", "hokkien", "Hokkien"],
  ["hakka", "hakka", "Hakka"], ["客家", "hakka", "Hakka"],
  ["western", "western", "Western"], ["西餐", "western", "Western"], ["british", "western", "Western"], ["english", "western", "Western"],
  ["italian", "western", "Western"], ["french", "western", "Western"], ["american", "western", "Western"],
  ["mexican", "mexican", "Mexican-style"], ["墨西哥", "mexican", "Mexican-style"],
  ["japanese", "japanese", "Japanese"], ["日本", "japanese", "Japanese"],
  ["korean", "korean", "Korean"], ["韩国", "korean", "Korean"],
  ["thai", "thai", "Thai"], ["泰国", "thai", "Thai"],
  ["malay", "southeast", "Malay / Indonesian"], ["malaysian", "southeast", "Malay / Indonesian"], ["indonesian", "southeast", "Malay / Indonesian"],
  ["spanish", "other", "Spanish / Fusion"], ["fusion", "other", "Spanish / Fusion"],
];

const TYPE_WORDS: [string, string, string][] = [
  ["meat", "meat", "Meat & poultry"], ["poultry", "meat", "Meat & poultry"], ["肉类", "meat", "Meat & poultry"],
  ["seafood", "seafood", "Fish & seafood"], ["海鲜", "seafood", "Fish & seafood"],
  ["vegetable", "veg", "Vegetables"], ["vegetables", "veg", "Vegetables"], ["veggie", "veg", "Vegetables"], ["蔬菜", "veg", "Vegetables"],
  ["soup", "soup", "Soups"], ["soups", "soup", "Soups"], ["汤", "soup", "Soups"],
  ["salad", "salad", "Salads"], ["salads", "salad", "Salads"], ["沙拉", "salad", "Salads"],
  ["pie", "pie", "Pies"], ["pies", "pie", "Pies"], ["tart", "pie", "Pies"], ["派", "pie", "Pies"],
  ["wrap", "wrap", "Wraps, bowls & quesadillas"], ["wraps", "wrap", "Wraps, bowls & quesadillas"], ["burrito", "wrap", "Wraps, bowls & quesadillas"],
  ["quesadilla", "wrap", "Wraps, bowls & quesadillas"], ["bowl", "wrap", "Wraps, bowls & quesadillas"], ["bowls", "wrap", "Wraps, bowls & quesadillas"],
  ["noodle", "meal", "Rice, noodles & porridge"], ["noodles", "meal", "Rice, noodles & porridge"], ["rice", "meal", "Rice, noodles & porridge"],
  ["porridge", "meal", "Rice, noodles & porridge"], ["congee", "meal", "Rice, noodles & porridge"], ["粥", "meal", "Rice, noodles & porridge"],
  ["面", "meal", "Rice, noodles & porridge"], ["饭", "meal", "Rice, noodles & porridge"],
];

/** Words that mean the same ingredient. Any one of them is enough. */
const SYNONYMS: string[][] = [
  ["prawn", "shrimp", "虾"], ["tofu", "bean curd", "beancurd", "豆腐"], ["aubergine", "eggplant", "brinjal", "茄子"],
  ["courgette", "zucchini"], ["coriander", "cilantro"], ["capsicum", "bell pepper"], ["spring onion", "scallion"],
  ["pork", "猪"], ["chicken", "鸡"], ["beef", "牛"], ["lamb", "mutton", "羊"], ["fish", "鱼"], ["egg", "蛋"],
  ["mushroom", "菇"], ["potato", "土豆", "马铃薯"], ["tomato", "番茄"], ["carrot", "胡萝卜"], ["cabbage", "白菜"],
];

const isZh = (s: string) => /[㐀-鿿]/.test(s);
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function take(q: string, table: [string, string, string][]): { id: string | null; label: string | null; rest: string } {
  let rest = q;
  let id: string | null = null;
  let label: string | null = null;
  const sorted = [...table].sort((a, b) => b[0].length - a[0].length);
  for (const [kw, tid, tl] of sorted) {
    const re = isZh(kw) ? new RegExp(esc(kw)) : new RegExp(`(^|\\s)${esc(kw)}(?=\\s|$)`, "i");
    if (re.test(rest)) {
      if (id === null) { id = tid; label = tl; }
      rest = rest.replace(re, " ");
    }
  }
  return { id, label, rest };
}

export function parseQuery(raw: string): ParsedQuery {
  const q = raw.trim().toLowerCase();
  if (!q) return { cuisineId: null, typeId: null, tokens: [], understood: [] };
  const c = take(q, CUISINE_WORDS);
  const t = take(c.rest, TYPE_WORDS);
  const tokens = t.rest.split(/\s+/).filter(Boolean);
  const understood: string[] = [];
  if (c.label) understood.push(c.label);
  if (t.label) understood.push(t.label);
  return { cuisineId: c.id, typeId: t.id, tokens, understood };
}

const forms = (tok: string): string[] => {
  const out = new Set<string>([tok]);
  if (tok.endsWith("ies") && tok.length > 4) out.add(tok.slice(0, -3) + "y");
  else if (tok.endsWith("es") && tok.length > 4) out.add(tok.slice(0, -2));
  if (tok.endsWith("s") && tok.length > 3) out.add(tok.slice(0, -1));
  for (const group of SYNONYMS) if (group.some((w) => out.has(w))) group.forEach((w) => out.add(w));
  return [...out];
};

/** 0 = no match. Higher = better match (name > main ingredient > any ingredient). */
export function matchScore(r: Recipe, tokens: string[]): number {
  if (tokens.length === 0) return 1;
  const name = r.name.toLowerCase();
  const zh = r.name_zh ?? "";
  const ing = (r.ingredients ?? []).map((i) => i.name.toLowerCase()).join(" | ");
  const main = mainProtein(r);
  let score = 0;
  for (const tok of tokens) {
    let best = 0;
    for (const f of forms(tok)) {
      if (name.includes(f) || (isZh(f) && zh.includes(f))) best = Math.max(best, 3);
      else if (main === f) best = Math.max(best, 2);
      else if (ing.includes(f)) best = Math.max(best, 1);
    }
    if (best === 0) return 0;
    score += best;
  }
  return score;
}
