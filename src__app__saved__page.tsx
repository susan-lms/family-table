"use client";

import { useState } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { useFavourites } from "@/components/FavouritesProvider";
import { findRecipe } from "@/lib/sample-data";
import { useMyRecipes } from "@/components/MyRecipesProvider";
import { buildRecipeShoppingList, formatQty } from "@/lib/shopping";
import { ingredientZh } from "@/lib/zh-ingredients";
import { emojiOf, fmtMinutes, totalMinutes } from "@/lib/browse";
import { Thumb } from "@/components/PhotosProvider";
import { CUISINE_TONE } from "@/lib/theme";
import { cuisineIdOf } from "@/lib/browse";
import type { Recipe } from "@/lib/types";

const SIZES = [2, 4, 6, 8];

export default function Saved() {
  useMyRecipes(); // so recipes the family added show up here too
  const { saved, toggle, setServings, clear } = useFavourites();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const entries = Object.entries(saved)
    .map(([id, servings]) => ({ recipe: findRecipe(id), servings }))
    .filter((e): e is { recipe: Recipe; servings: number } => !!e.recipe);
  const items = buildRecipeShoppingList(entries);
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-rose-600">♥ Saved recipes 收藏</h1>
      {entries.length === 0 ? (
        <p className="rounded-xl bg-stone-100 px-4 py-4 text-lg">
          Nothing saved yet. Tap “♡ Save” on any recipe and it will appear here, with one shopping list for all of them.{" "}
          <Link href="/" className="font-semibold text-emerald-800 underline">Find recipes</Link>
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {entries.map(({ recipe: r, servings }) => (
              <li key={r.recipe_id} className={`rounded-2xl border border-l-8 border-stone-200 bg-white p-4 ${CUISINE_TONE[cuisineIdOf(r)].edge}`}>
                <Link href={`/cook/${r.recipe_id}?for=${servings}`} className="flex items-center gap-3">
                  <Thumb id={r.recipe_id} emoji={emojiOf(r)} size={64} />
                  <span className="flex-1">
                    <span className="block text-xl font-bold">{r.name}</span>
                    {r.name_zh && <span className="block text-lg text-stone-700">{r.name_zh}</span>}
                    <span className="text-base text-stone-600">⏱ {fmtMinutes(totalMinutes(r))}</span>
                  </span>
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={`People for ${r.name}`}>
                  <span className="text-lg">Cook for:</span>
                  {SIZES.map((n) => (
                    <button key={n} onClick={() => setServings(r.recipe_id, n)} className={`rounded-full px-4 py-2 text-lg font-semibold ${servings === n ? "bg-emerald-700 text-white" : "bg-stone-200"}`}>{n}</button>
                  ))}
                  <button onClick={() => toggle(r.recipe_id)} className="ml-auto rounded-full border-2 border-stone-300 px-4 py-2 text-base font-semibold">Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-emerald-800">Shopping list 购物清单</h2>
            <p className="text-lg">For all the saved recipes, added together.</p>
            <PrintButton />
            {categories.map((c) => (
              <div key={c}>
                <h3 className="text-xl font-semibold text-emerald-800">{c}</h3>
                <ul>
                  {items.filter((i) => i.category === c).map((i) => {
                    const key = `${i.name}|${i.unit}`;
                    return (
                      <li key={key} className="border-b border-stone-200">
                        <label className="flex cursor-pointer items-center gap-3 py-3 text-lg">
                          <input type="checkbox" className="h-6 w-6" checked={!!checked[key]} onChange={() => setChecked((s) => ({ ...s, [key]: !s[key] }))} />
                          <span className={checked[key] ? "text-stone-400 line-through" : ""}>
                            {i.name}{ingredientZh(i.name) ? ` ${ingredientZh(i.name)}` : ""} — <strong>{formatQty(i.qty, i.unit)}</strong>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
          <button onClick={() => { if (confirm("Remove all saved recipes?")) clear(); }} className="no-print rounded-xl border-2 border-stone-300 px-5 py-3 text-lg font-semibold">Clear all saved</button>
        </>
      )}
    </div>
  );
}
