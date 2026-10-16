"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { setUserRecipes } from "@/lib/sample-data";
import { MY_PREFIX } from "@/lib/my-recipes";
import type { Recipe } from "@/lib/types";

const KEY = "family-table-mine-v1";

/** Recipes the family added by hand. Stored on this phone or computer only (in the browser), never sent anywhere. */
interface Ctx {
  recipes: Recipe[];
  ready: boolean;
  save: (r: Recipe) => void; // add or replace (same id)
  remove: (id: string) => void;
  restore: (list: Recipe[]) => number; // from a backup file; returns how many were added or updated
  newId: () => string;
}
const MyContext = createContext<Ctx | null>(null);

const valid = (x: unknown): x is Recipe =>
  !!x && typeof x === "object" && typeof (x as Recipe).recipe_id === "string" && (x as Recipe).recipe_id.startsWith(MY_PREFIX) &&
  typeof (x as Recipe).name === "string" && Array.isArray((x as Recipe).ingredients) && Array.isArray((x as Recipe).steps);

export function MyRecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const list = raw ? (JSON.parse(raw) as unknown[]).filter(valid) : [];
      setUserRecipes(list);
      setRecipes(list);
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  const write = useCallback((next: Recipe[]) => {
    setUserRecipes(next);
    setRecipes(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full or blocked */ }
  }, []);

  const save = useCallback((r: Recipe) => {
    write(recipes.some((x) => x.recipe_id === r.recipe_id) ? recipes.map((x) => (x.recipe_id === r.recipe_id ? r : x)) : [...recipes, r]);
  }, [recipes, write]);
  const remove = useCallback((id: string) => write(recipes.filter((x) => x.recipe_id !== id)), [recipes, write]);
  const restore = useCallback((list: Recipe[]) => {
    const good = list.filter(valid);
    const byId = new Map(recipes.map((r) => [r.recipe_id, r]));
    for (const r of good) byId.set(r.recipe_id, { ...r, mine: true });
    write([...byId.values()]);
    return good.length;
  }, [recipes, write]);
  const newId = useCallback(() => `${MY_PREFIX}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, []);

  return <MyContext.Provider value={{ recipes, ready, save, remove, restore, newId }}>{children}</MyContext.Provider>;
}

export function useMyRecipes(): Ctx {
  const c = useContext(MyContext);
  if (!c) throw new Error("useMyRecipes must be used inside MyRecipesProvider");
  return c;
}
