import type { Recipe } from "./types";

export type ProteinType = "chicken" | "pork" | "beef" | "lamb" | "fish" | "seafood" | "egg & tofu" | "meat-free";

export const PROTEIN_TYPES: ProteinType[] = ["chicken", "pork", "beef", "lamb", "fish", "seafood", "egg & tofu", "meat-free"];

/** Main protein of a dish, worked out from its ingredient names. Soups and vegetable dishes count only if they have meat or fish in them. */
export function mainProtein(r: Recipe): ProteinType {
  const names = (r.ingredients ?? []).map((g) => g.name.toLowerCase()).join(" | ");
  if (/beef/.test(names)) return "beef";
  if (/lamb|mutton/.test(names)) return "lamb";
  if (/prawn|squid|crab|clam|mussel|scallop(?!s or)|shellfish/.test(names)) return "seafood";
  if (/salmon|cod |cod$|sea bass|mackerel|white fish|fish fillet|tuna|barramundi|snapper|\bfish\b(?! sauce)/.test(names)) return "fish";
  if (/pork|ribs|bacon|ham\b/.test(names)) return "pork";
  if (/chicken/.test(names)) return "chicken";
  if (/\begg|tofu|tempeh/.test(names)) return "egg & tofu";
  return "meat-free";
}
