"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartButton } from "@/components/FavouritesProvider";
import { recipeSodium } from "@/lib/sodium";
import { SENIOR_TIP, isSoft } from "@/lib/softness";
import { LEFTOVER_TIP, isCalciumRich, keepsWell } from "@/lib/nutrition";
import { ingredientZh } from "@/lib/zh-ingredients";
import type { Recipe } from "@/lib/types";

const fmt = (n: number) => `${+n.toFixed(2)}`;

export default function CookMode({ recipe, initialServings = 8 }: { recipe: Recipe; initialServings?: number }) {
  const router = useRouter();
  const steps = recipe.steps ?? [];
  const [i, setI] = useState(0);
  const [have, setHave] = useState<Record<number, boolean>>({});
  const [servings, setServings] = useState<number>(initialServings);
  const factor = servings / 8;

  return (
    <div className="space-y-5">
      <button onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))} className="text-lg font-semibold text-emerald-800 underline">← Back</button>
      <h1 className="text-3xl font-bold">{recipe.name}</h1>
      {recipe.name_zh && <p className="text-2xl font-semibold text-stone-700">{recipe.name_zh}</p>}
      {isSoft(recipe) && <p className="text-lg"><span className="rounded-full bg-sky-100 px-3 py-1 font-semibold text-sky-900">Soft</span> Easy to chew for the seniors.</p>}
      <p className="flex flex-wrap items-center gap-2 text-lg">
        <span className={`rounded-full px-3 py-1 font-semibold ${recipe.prep_time_minutes + recipe.cook_time_minutes <= 30 ? "bg-emerald-100 text-emerald-900" : "bg-stone-200"}`}>⏱ {recipe.prep_time_minutes + recipe.cook_time_minutes} min in all</span>
        <span>Prep {recipe.prep_time_minutes} min · Cook {recipe.cook_time_minutes} min · For {servings} people</span>
      </p>
      <p className="text-base text-stone-700">
        About {Math.round(recipeSodium(recipe) / 8 / 10) * 10} mg sodium per person (rough estimate; the daily limit is 2,000 mg for all food). Rough cost S${(recipe.estimated_cost_sgd * servings / 8).toFixed(2)}.
      </p>
      <HeartButton id={recipe.recipe_id} servings={servings} big />
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Number of people"><span className="text-lg font-semibold">Cook for:</span>
        {[2, 4, 6, 8].map((n) => (
          <button
            key={n}
            onClick={() => setServings(n)}
            className={`rounded-full px-4 py-3 text-lg font-semibold ${servings === n ? "bg-emerald-700 text-white" : "bg-stone-200"}`}
          >
            {n}
          </button>
        ))}
      </div>
      {recipe.dish_class === "onepot" && (
        <p className="rounded-lg bg-emerald-100 px-4 py-3 text-lg font-medium text-emerald-900">
          Quick one-pot meal: rice, protein and vegetables together. Cook the soup separately.
        </p>
      )}
      {(recipe.dish_class === "protein" || recipe.dish_class === "onepot" || recipe.dish_class === "onedish") && (
        <p className="rounded-lg border-2 border-sky-300 bg-sky-50 px-4 py-3 text-lg text-sky-900">{SENIOR_TIP}</p>
      )}
      {isCalciumRich(recipe) && <p className="text-lg"><span className="rounded-full bg-violet-100 px-3 py-1 font-semibold text-violet-900">Calcium-rich</span> Has tofu, greens or other calcium foods.</p>}
      {recipe.festival && <p className="text-lg"><span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-900">Festival dish</span></p>}
      {keepsWell(recipe) && <p className="rounded-lg bg-stone-100 px-4 py-3 text-base text-stone-800">{LEFTOVER_TIP}</p>}
      {recipe.dish_class === "onedish" && (
        <p className="rounded-lg bg-indigo-50 px-4 py-3 text-lg font-medium text-indigo-900">
          A complete {recipe.meal === "porridge" ? "porridge" : recipe.meal === "noodles" ? "noodle" : recipe.meal === "sandwich" ? "sandwich" : "one-dish"} meal with protein and vegetables. No other dishes needed. At dinner, serve with a soup.
        </p>
      )}
      <p className="text-sm text-stone-500">Sample recipe — not yet taste-tested.</p>

      {recipe.food_safety && (
        <p className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-lg font-medium text-red-900">
          Safety: {recipe.food_safety}
        </p>
      )}

      {recipe.allergens && recipe.allergens.length > 0 && (
        <p className="rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3 text-lg font-medium text-amber-900">
          Contains: {recipe.allergens.join(", ")}. Check ingredient labels if anyone has an allergy.
        </p>
      )}

      <section>
        <h2 className="text-xl font-semibold text-emerald-800">Ingredients</h2>
        <ul>
          {(recipe.ingredients ?? []).map((ing, n) => (
            <li key={n} className="border-b border-stone-200">
              <label className="flex cursor-pointer items-center gap-3 py-3 text-lg">
                <input type="checkbox" className="h-6 w-6" checked={!!have[n]} onChange={() => setHave((s) => ({ ...s, [n]: !s[n] }))} />
                <span className={have[n] ? "text-stone-400 line-through" : ""}>
                  <strong>{fmt(ing.qty * factor)} {ing.unit === "piece" ? "pcs" : ing.unit}</strong> {ing.name}{ingredientZh(ing.name) ? ` ${ingredientZh(ing.name)}` : ""}{ing.prep ? `, ${ing.prep}` : ""}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {recipe.equipment && <p className="mt-2 text-base text-stone-700">You need: {recipe.equipment.join(", ")}.</p>}
      </section>

      <section className="rounded-2xl border border-stone-300 bg-white p-5">
        <p className="text-base font-semibold text-stone-600">Step {i + 1} of {steps.length}</p>
        <p className="mt-2 min-h-[6rem] text-2xl leading-relaxed">{steps[i]}</p>
        <div className="mt-4 flex gap-3">
          <button
            className="flex-1 rounded-xl bg-stone-200 px-4 py-4 text-xl font-semibold disabled:opacity-40"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
          >
            Previous
          </button>
          <button
            className="flex-1 rounded-xl bg-emerald-700 px-4 py-4 text-xl font-semibold text-white disabled:opacity-40"
            disabled={i === steps.length - 1}
            onClick={() => setI(i + 1)}
          >
            Next
          </button>
        </div>
        {i === steps.length - 1 && <p className="mt-4 text-xl font-semibold text-emerald-800">✓ Last step. Well done!</p>}
      </section>

      {recipe.oil_salt_sugar_note && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-base text-emerald-900">Low oil, salt and sugar: {recipe.oil_salt_sugar_note}</p>
      )}
    </div>
  );
}
