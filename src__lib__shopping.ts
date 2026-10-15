import type { Category, Ingredient, PlannedDay, Recipe, Slot } from "./types";
import { slotFactor } from "./servings";
import { fruitFor } from "./nutrition";

const SLOTS: Slot[] = ["lunch", "dinner"];

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
    for (const slot of SLOTS) {
      const factor = slotFactor(slot); // lunch is for 4 people, so half of the 8-person recipe
      for (const r of day.slots[slot] ?? []) {
        if (!r.ingredients) { missing.add(r.name); continue; }
        const key = `${day.date}|${slot}|${r.recipe_id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        for (const ing of r.ingredients) {
          const n = normalise(ing);
          const k = `${ing.name.toLowerCase()}|${n.unit}`;
          const existing = map.get(k);
          if (existing) existing.qty += n.qty * factor;
          else map.set(k, { name: ing.name, qty: n.qty * factor, unit: n.unit, category: ing.category });
        }
      }
    }
  }
  // fruit after dinner (one kind a day, quantities for 8)
  for (const day of days) {
    const f = fruitFor(day.date);
    const k = `${f.name.toLowerCase()}|${f.unit}`;
    const existing = map.get(k);
    if (existing) existing.qty += f.qty;
    else map.set(k, { name: f.name, qty: f.qty, unit: f.unit, category: "Fruit" });
  }
  // whole items (eggs, lemons...) are bought in whole pieces
  for (const item of map.values()) if (item.unit === "piece") item.qty = Math.ceil(item.qty - 1e-9);
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

/** Shopping list for chosen recipes (saved recipes). Each recipe is written for 8, so its amounts are scaled to the number of people chosen. */
export function buildRecipeShoppingList(entries: Array<{ recipe: Recipe; servings: number }>): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();
  for (const { recipe, servings } of entries) {
    const factor = servings / 8;
    for (const ing of recipe.ingredients ?? []) {
      if (ing.category === "Other" && /^(warm |cold )?water$/i.test(ing.name)) continue; // tap water is not shopping
      const n = normalise(ing);
      const k = `${ing.name.toLowerCase()}|${n.unit}`;
      const existing = map.get(k);
      if (existing) existing.qty += n.qty * factor;
      else map.set(k, { name: ing.name, qty: n.qty * factor, unit: n.unit, category: ing.category });
    }
  }
  for (const item of map.values()) if (item.unit === "piece") item.qty = Math.ceil(item.qty - 1e-9);
  return [...map.values()].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

/** Add two shopping lists together (same name and unit are summed). */
export function mergeShoppingLists(a: ShoppingItem[], b: ShoppingItem[]): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();
  for (const item of [...a, ...b]) {
    const k = `${item.name.toLowerCase()}|${item.unit}`;
    const existing = map.get(k);
    if (existing) existing.qty += item.qty; else map.set(k, { ...item });
  }
  return [...map.values()].sort((x, y) => x.category.localeCompare(y.category) || x.name.localeCompare(y.name));
}
