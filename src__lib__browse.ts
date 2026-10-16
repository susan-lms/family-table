import type { Recipe } from "./types";
import { mainProtein, type ProteinType } from "./protein";

/** Helpers for the recipe book: cuisine tiles, dish-type chips and the 30-minute check. */
export const totalMinutes = (r: Recipe): number => r.prep_time_minutes + r.cook_time_minutes;
export const QUICK_MINUTES = 30;
/** 25 -> "25 min", 80 -> "1 h 20 min". */
export const fmtMinutes = (m: number): string => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`);
export const TIME_OPTIONS = [
  { id: "any", label: "Any time", max: Infinity },
  { id: "30", label: "30 min or less ⏱", max: 30 },
  { id: "60", label: "1 hour or less", max: 60 },
] as const;

export interface Facet { id: string; label: string; zh: string; emoji: string; test: (r: Recipe) => boolean }

const cu = (c: Recipe["cuisine"]) => (r: Recipe) => r.cuisine === c;
const rg = (g: NonNullable<Recipe["region"]>) => (r: Recipe) => r.region === g;

export const CUISINES: Facet[] = [
  { id: "all", label: "All cuisines", zh: "全部", emoji: "🍽️", test: () => true },
  { id: "mine", label: "My recipes", zh: "我的食谱", emoji: "⭐", test: (r) => !!r.mine },
  { id: "chinese", label: "Chinese (all)", zh: "中餐", emoji: "🥢", test: cu("Chinese") },
  { id: "cantonese", label: "Cantonese", zh: "粤菜", emoji: "🦆", test: rg("Cantonese") },
  { id: "teochew", label: "Teochew", zh: "潮州菜", emoji: "🐟", test: rg("Teochew") },
  { id: "hokkien", label: "Hokkien", zh: "福建菜", emoji: "🍜", test: rg("Hokkien") },
  { id: "hakka", label: "Hakka", zh: "客家菜", emoji: "🍵", test: rg("Hakka") },
  { id: "western", label: "Western", zh: "西餐", emoji: "🥧", test: cu("Western") },
  { id: "mexican", label: "Mexican-style", zh: "墨西哥风味", emoji: "🌯", test: cu("Mexican") },
  { id: "japanese", label: "Japanese", zh: "日本菜", emoji: "🍣", test: cu("Japanese") },
  { id: "korean", label: "Korean", zh: "韩国菜", emoji: "🥬", test: cu("Korean") },
  { id: "thai", label: "Thai", zh: "泰国菜", emoji: "🌿", test: cu("Thai") },
  { id: "southeast", label: "Malay / Indonesian", zh: "马来/印尼", emoji: "🥥", test: (r) => r.cuisine === "Malaysian" || r.cuisine === "Indonesian" },
  { id: "other", label: "Spanish / Fusion", zh: "西班牙/融合", emoji: "🥘", test: (r) => r.cuisine === "Spanish" || r.cuisine === "Fusion" },
];

const MEATS: ProteinType[] = ["chicken", "pork", "beef", "lamb"];
const dishy = (r: Recipe) => r.dish_class === "protein" || r.dish_class === "wrap";

export const TYPES: Facet[] = [
  { id: "all", label: "All dishes", zh: "全部", emoji: "🍽️", test: () => true },
  { id: "meat", label: "Meat & poultry", zh: "肉类", emoji: "🍗", test: (r) => dishy(r) && MEATS.includes(mainProtein(r)) },
  { id: "seafood", label: "Fish & seafood", zh: "海鲜", emoji: "🐟", test: (r) => dishy(r) && ["fish", "seafood"].includes(mainProtein(r)) },
  { id: "veg", label: "Vegetables", zh: "蔬菜", emoji: "🥬", test: (r) => r.dish_class === "vegetable" },
  { id: "eggtofu", label: "Egg & tofu", zh: "蛋和豆腐", emoji: "🥚", test: (r) => r.dish_class === "protein" && mainProtein(r) === "egg & tofu" },
  { id: "soup", label: "Soups", zh: "汤", emoji: "🍲", test: (r) => r.dish_class === "soup" },
  { id: "wrap", label: "Wraps, bowls & quesadillas", zh: "卷饼/饭碗/烤饼", emoji: "🌯", test: (r) => r.dish_class === "wrap" },
  { id: "pie", label: "Pies", zh: "派", emoji: "🥧", test: (r) => r.dish_class === "pie" },
  { id: "salad", label: "Salads", zh: "沙拉", emoji: "🥗", test: (r) => r.dish_class === "salad" },
  { id: "meal", label: "Rice, noodles & porridge", zh: "饭/面/粥", emoji: "🍜", test: (r) => r.dish_class === "onepot" || r.dish_class === "onedish" },
];

export const MEAT_CHIPS: ProteinType[] = ["chicken", "pork", "beef", "lamb"];

/** Emoji for a recipe card. */
export function emojiOf(r: Recipe): string {
  for (const t of TYPES) if (t.id !== "all" && t.id !== "meat" && t.id !== "seafood" && t.test(r)) return t.emoji;
  const p = mainProtein(r);
  if (p === "chicken") return "🍗";
  if (p === "lamb") return "🍖";
  if (p === "pork" || p === "beef") return "🥩";
  if (p === "fish" || p === "seafood") return "🐟";
  return "🍽️";
}

/** Which cuisine tile a recipe belongs to (used for its colour). */
export function cuisineIdOf(r: Recipe): string {
  if (r.mine) return "mine";
  if (r.region) return r.region.toLowerCase();
  switch (r.cuisine) {
    case "Chinese": return "chinese";
    case "Western": return "western";
    case "Mexican": return "mexican";
    case "Japanese": return "japanese";
    case "Korean": return "korean";
    case "Thai": return "thai";
    case "Malaysian": case "Indonesian": return "southeast";
    default: return "other";
  }
}

/** Short label for the card badge: region first, then cuisine. */
export const originOf = (r: Recipe): string => r.region ?? (r.cuisine === "Mexican" ? "Mexican-style" : r.cuisine);
