"use client";

import { useState } from "react";
import { library } from "@/lib/sample-data";
import { repeatConflict } from "@/lib/rules";
import type { Cuisine, PlannedDay, Recipe } from "@/lib/types";

const CUISINES: Array<"All" | Cuisine> = ["All", "Chinese", "Western", "Japanese", "Korean", "Fusion", "Spanish", "Thai", "Indonesian", "Malaysian", "Indian"];

interface Props {
  date: string;
  allDays: PlannedDay[];
  current: Recipe;
  message: string;
  onPick: (recipe: Recipe) => void;
  onClose: () => void;
}

export default function SwapDialog({ date, allDays, current, message, onPick, onClose }: Props) {
  const [cuisine, setCuisine] = useState<"All" | Cuisine>("All");

  const options = library.filter(
    (r) => r.dish_class === current.dish_class && r.recipe_id !== current.recipe_id && (cuisine === "All" || r.cuisine === cuisine),
  );

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 md:items-center" role="dialog" aria-modal="true" aria-label="Change dish">
      <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 md:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Change dish</h2>
            <p className="mt-1 text-lg text-stone-700">Now: <strong>{current.name}</strong></p>
          </div>
          <button onClick={onClose} className="rounded-xl bg-stone-200 px-4 py-3 text-lg font-semibold">Close</button>
        </div>

        <p className="mt-3 text-base text-stone-600">Choose another dish of the same type. The rest of the day stays the same.</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`rounded-full px-4 py-2 text-base font-semibold ${cuisine === c ? "bg-emerald-700 text-white" : "bg-stone-200"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {message && <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-base font-medium text-red-900">{message}</p>}

        {options.length === 0 && <p className="mt-4 text-lg text-stone-600">No other dishes of this type for this cuisine yet.</p>}

        <ul className="mt-3 space-y-2">
          {options.map((r) => {
            const conflict = repeatConflict(allDays, date, r);
            return (
              <li key={r.recipe_id}>
                <button
                  disabled={!!conflict}
                  onClick={() => onPick(r)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-left disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
                >
                  <span className="block text-lg font-semibold">{r.name}</span>
                  <span className="block text-base">
                    {r.cuisine} · Prep {r.prep_time_minutes} min · Cook {r.cook_time_minutes} min · S${r.estimated_cost_sgd.toFixed(2)} (sample)
                  </span>
                  {conflict ? (
                    <span className="block text-base font-medium text-red-700">Not available: {conflict}</span>
                  ) : (
                    !r.steps && <span className="block text-sm text-stone-500">Recipe steps coming soon</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
