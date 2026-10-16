"use client";

import { useEffect, useState } from "react";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";
import { buildRecipeShoppingList, buildShoppingList, formatQty, mergeShoppingLists } from "@/lib/shopping";
import { findRecipe } from "@/lib/sample-data";
import { useMyRecipes } from "@/components/MyRecipesProvider";
import { useExtras } from "@/components/ExtrasProvider";
import type { Recipe } from "@/lib/types";
import { ingredientZh } from "@/lib/zh-ingredients";
import { todaySG } from "@/lib/plan-data";
import { usePlan } from "@/components/PlanProvider";

export default function Shopping() {
  useMyRecipes(); // so recipes the family added show up here too
  const { days: planDays } = usePlan();
  const todayIdx = Math.max(0, planDays.findIndex((d) => d.date === todaySG()));
  const [count, setCount] = useState(3);
  const [from, setFrom] = useState(todayIdx);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // dates chosen on the Meal plan calendar arrive as ?from=...&to=...
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const f = p.get("from"), t = p.get("to");
    if (f && t && /^\d{4}-\d{2}-\d{2}$/.test(f) && /^\d{4}-\d{2}-\d{2}$/.test(t)) setRange({ from: f, to: t });
  }, []);

  const days = range ? planDays.filter((d) => d.date >= range.from && d.date <= range.to) : planDays.slice(from, from + count);
  const { extras } = useExtras();
  const dates = new Set(days.map((d) => d.date));
  const added = extras
    .filter((x) => dates.has(x.date))
    .map((x) => ({ recipe: findRecipe(x.recipeId), servings: x.servings }))
    .filter((x): x is { recipe: Recipe; servings: number } => !!x.recipe);
  const planList = buildShoppingList(days);
  const items = mergeShoppingLists(planList.items, buildRecipeShoppingList(added));
  const recipesWithoutDetails = planList.recipesWithoutDetails;
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-orange-600">🛒 Shopping list 购物清单</h1>
      <PrintButton />
      {range && (
        <p className="rounded-xl bg-emerald-100 px-4 py-3 text-lg font-semibold text-emerald-900">
          Dates chosen on the calendar: {range.from} to {range.to}{" "}
          <button className="ml-2 rounded-full bg-white px-3 py-1 text-base underline" onClick={() => setRange(null)}>Choose by number of days instead</button>
        </p>
      )}
      <p className="text-lg">{added.length > 0 ? `Includes ${added.length} recipe${added.length === 1 ? "" : "s"} you added to these dates. ` : ""}Plan dishes are for 8 people (lunch for 4). {range ? "" : "How many days do you want to shop for?"}</p>
      <div className={`no-print flex flex-wrap gap-2 ${range ? "hidden" : ""}`}>
        {[1, 3, 7, 14].map((n) => (
          <button key={n} onClick={() => setCount(n)} className={`rounded-full px-5 py-3 text-lg font-semibold ${count === n ? "bg-emerald-700 text-white" : "bg-stone-200"}`}>
            {n === 1 ? "1 day" : `${n} days`}
          </button>
        ))}
      </div>
      {!range && days.length > 0 && (
        <div className="no-print flex items-center justify-between gap-3">
          <button className="rounded-xl bg-stone-200 px-4 py-3 text-lg font-semibold disabled:opacity-40" disabled={from === 0} onClick={() => setFrom(Math.max(0, from - count))}>← Earlier</button>
          <p className="text-center text-lg font-semibold">{days[0].date} to {days[days.length - 1].date}</p>
          <button className="rounded-xl bg-stone-200 px-4 py-3 text-lg font-semibold disabled:opacity-40" disabled={from + count >= planDays.length} onClick={() => setFrom(from + count)}>Later →</button>
        </div>
      )}

      {recipesWithoutDetails.length > 0 && (
        <p className="rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">
          Not included yet (no ingredient list written): {recipesWithoutDetails.join(", ")}.
        </p>
      )}

      {items.length === 0 && <p className="text-lg text-stone-600">Nothing to buy for these days yet.</p>}

      {categories.map((c) => (
        <section key={c}>
          <h2 className="text-xl font-semibold text-emerald-800">{c}</h2>
          <ul>
            {items.filter((i) => i.category === c).map((i) => {
              const key = `${i.name}|${i.unit}`;
              return (
                <li key={key} className="border-b border-stone-200">
                  <label className="flex cursor-pointer items-center gap-3 py-3 text-lg">
                    <input
                      type="checkbox"
                      className="h-6 w-6"
                      checked={!!checked[key]}
                      onChange={() => setChecked((s) => ({ ...s, [key]: !s[key] }))}
                    />
                    <span className={checked[key] ? "text-stone-400 line-through" : ""}>
                      {i.name}{ingredientZh(i.name) ? ` ${ingredientZh(i.name)}` : ""} — <strong>{formatQty(i.qty, i.unit)}</strong>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <Link href="/today" className="no-print inline-block text-lg font-semibold text-emerald-800 underline">Back to today</Link>
    </div>
  );
}
