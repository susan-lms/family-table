"use client";

import { useState } from "react";
import Link from "next/link";
import type { Recipe } from "@/lib/types";

export default function CookMode({ recipe }: { recipe: Recipe }) {
  const steps = recipe.steps ?? [];
  const [i, setI] = useState(0);
  const [have, setHave] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-5">
      <Link href="/" className="text-lg font-semibold text-emerald-800 underline">← Back</Link>
      <h1 className="text-3xl font-bold">{recipe.name}</h1>
      <p className="text-lg">
        For 8 people · Prep {recipe.prep_time_minutes} min · Cook {recipe.cook_time_minutes} min
      </p>
      <p className="text-sm text-stone-500">Sample recipe — not yet taste-tested.</p>

      {recipe.food_safety && (
        <p className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-lg font-medium text-red-900">
          Safety: {recipe.food_safety}
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
                  <strong>{ing.qty} {ing.unit === "piece" ? "pcs" : ing.unit}</strong> {ing.name}{ing.prep ? `, ${ing.prep}` : ""}
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
