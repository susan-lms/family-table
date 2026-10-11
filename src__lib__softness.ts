import type { Recipe } from "./types";

/**
 * "Soft" = easy to chew for older people: steamed, braised, stewed, simmered, poached, porridge/congee, soups,
 * tofu and egg dishes, and rice-cooker meals. Crispy, fried, grilled and roasted dishes are not marked soft.
 * This is a guide from the cooking method, not a medical rating.
 * If someone has trouble swallowing, ask their doctor or a dietitian what texture is safe.
 */
const NOT_SOFT = /crispy|fried|air-fr|pan-fr|roast|grill|skewer|cutlet|nugget|tempura|karaage|fingers|fish and chips|stir-fr|baked|bake |fries|fritter|spring roll|samosa|puff|strips|wedges|chops|patties/i;
const SOFT_METHOD = /steam|braise|stew|simmer|poach|porridge|congee|custard|\bsoup\b|tofu|scramble|omelette|rice cooker|bento|claypot|pulao|paella/i;

const TENDER_VEG = /choy|bok choy|spinach|lettuce|cabbage|napa|pumpkin|zucchini|courgette|eggplant|mushroom|okra|tomato|winter melon|kangkong|water spinach|cauliflower|broccoli|kailan|chayote|sweet potato/i;
const HARD_VEG = /salad|air-fr|roast|fries|crispy|raw/i;

export function isSoft(r: Recipe): boolean {
  if (r.dish_class === "soup") return true;
  if (r.dish_class === "vegetable" && TENDER_VEG.test(r.name) && !HARD_VEG.test(r.name)) return true;
  if (/minced|scramble/i.test(r.name) && !/crispy|fried|air-fr|nugget|wrap/i.test(r.name)) return true;
  const text = `${r.name} ${(r.equipment ?? []).join(" ")}`;
  const steps = (r.steps ?? []).join(" ");
  // rice-cooker one-pot meals and anything steamed/braised/simmered
  if (NOT_SOFT.test(r.name)) return false;
  if (SOFT_METHOD.test(text)) return true;
  if (/\b(steam|simmer|braise)\b/i.test(steps) && !/fry (the )?(chicken|pork|beef|fish)|air-fry|bake/i.test(steps)) return true;
  return false;
}

/** Tip shown on the cooking page for meat, fish and one-pot dishes. */
export const SENIOR_TIP =
  "For the seniors: cut meat and fish into small pieces (about 1.5 cm or smaller), take out bones, skin and shells, and spoon some soup or juices over the food. Food should mash easily with a fork. If anyone coughs or chokes when eating, ask a doctor or dietitian about the right texture.";
