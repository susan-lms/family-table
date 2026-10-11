import type { Category, Ingredient, PlannedDay } from "./types";

export interface ShoppingItem {
  name: string;
  qty: number;
  unit: string;
  category: Category;
}

/** Turn kg into g and l into ml so matching items can be added together. */
function normalise(i: Ingredient): { qty: number; unit: string } {
  if (i.unit === "kg") return { qty: i.qty * 1000, unit: "g" };
  if (i.unit === "l") return { qty: i.qty * 1000, unit: "ml" };
  return { qty: i.qty, unit: i.unit };
}

/** Add up the same ingredient (same name, same unit) across all recipes in the chosen days. */
export function buildShoppingList(days: PlannedDay[]): { items: ShoppingItem[]; recipesWithoutDetails: string[] } {
  const map = new Map<string, ShoppingItem>();
  const missing = new Set<string>();
  const seen = new Set<string>(); // each recipe counted once per day it is planned

  for (const day of days) {
    const recipes = Object.values(day.slots).flat();
    for (const r of recipes) {
      if (!r.ingredients) { missing.add(r.name); continue; }
      const key = `${day.date}|${r.recipe_id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      for (const ing of r.ingredients) {
        const n = normalise(ing);
        const k = `${ing.name.toLowerCase()}|${n.unit}`;
        const existing = map.get(k);
        if (existing) existing.qty += n.qty;
        else map.set(k, { name: ing.name, qty: n.qty, unit: n.unit, category: ing.category });
      }
    }
  }
  return {
    items: [...map.values()].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
    recipesWithoutDetails: [...missing],
  };
}

/** Show 1200 g as "1.2 kg" and 2500 ml as "2.5 l". */
export function formatQty(qty: number, unit: string): string {
  if (unit === "g" && qty >= 1000) return `${+(qty / 1000).toFixed(2)} kg`;
  if (unit === "ml" && qty >= 1000) return `${+(qty / 1000).toFixed(2)} l`;
  return `${+qty.toFixed(2)} ${unit === "piece" ? "pcs" : unit}`;
}
