"use client";

import { useState } from "react";
import { catalog, EXCLUDED_CUISINES } from "@/lib/sample-data";
import { CUISINES, cuisineIdOf, fmtMinutes, totalMinutes } from "@/lib/browse";
import { CUISINE_TONE } from "@/lib/theme";
import { repeatConflict } from "@/lib/rules";
import type { PlannedDay, Recipe } from "@/lib/types";
import { isSoft } from "@/lib/softness";
import { mainProtein } from "@/lib/protein";


interface Props {
  slot?: "lunch" | "dinner";
  date: string;
  allDays: PlannedDay[];
  current: Recipe;
  message: string;
  onPick: (recipe: Recipe) => void;
  onClose: () => void;
}

export default function SwapDialog({ slot, date, allDays, current, message, onPick, onClose }: Props) {
  const [cuisine, setCuisine] = useState("all");
  const [q, setQ] = useState("");
  const test = CUISINES.find((c) => c.id === cuisine)!.test;
  const needle = q.trim().toLowerCase();

  // every dish of the same type from the whole recipe book (festival-only dishes are kept for their own dinners)
  const options = catalog.filter(
    (r) =>
      r.dish_class === current.dish_class && r.recipe_id !== current.recipe_id && !r.festival && !EXCLUDED_CUISINES.includes(r.cuisine) && test(r) &&
      (needle === "" || r.name.toLowerCase().includes(needle) || (r.name_zh ?? "").includes(q.trim())) &&
      !(slot === "dinner" && r.meal === "porridge"), // porridge is a lunch choice
  );

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 md:items-center" role="dialog" aria-modal="true" aria-label="Change dish">
      <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 md:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Change dish</h2>
            <p className="mt-1 text-lg text-stone-700">Now: <strong>{current.name} {current.name_zh}</strong></p>
          </div>
          <button onClick={onClose} className="rounded-xl bg-stone-200 px-4 py-3 text-lg font-semibold">Close</button>
        </div>

        <p className="mt-3 text-base text-stone-600">Choose another dish of the same type from the whole recipe book. The rest of the day stays the same, and the meal rules are checked for you.</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCuisine(c.id)}
              aria-pressed={cuisine === c.id}
              className={`rounded-full border-2 px-4 py-2 text-base font-semibold ${cuisine === c.id ? CUISINE_TONE[c.id].on : CUISINE_TONE[c.id].tile}`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, e.g. fish, 豆腐" aria-label="Search dishes" className="mt-3 w-full rounded-xl border-2 border-stone-300 px-4 py-3 text-lg" />
        <p className="mt-2 text-base font-semibold">{options.length} dish{options.length === 1 ? "" : "es"}</p>

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
                  <span className="block text-lg font-semibold"><span className={`mr-2 rounded-full px-2 py-0.5 text-sm ${CUISINE_TONE[cuisineIdOf(r)].badge}`}>{r.region ?? r.cuisine}</span>{r.name} {r.name_zh}{isSoft(r) ? " · Soft" : ""}{r.treat ? " · Treat" : ""}</span>
                  <span className="block text-base">
                    {r.cuisine}{r.dish_class === "protein" || r.dish_class === "onepot" || r.dish_class === "onedish" ? ` · ${mainProtein(r)}` : ""} · ⏱ {fmtMinutes(totalMinutes(r))} · S${r.estimated_cost_sgd.toFixed(2)} for 8 (estimate)
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
