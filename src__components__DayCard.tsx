"use client";

import { useState } from "react";
import Link from "next/link";
import { SLOT_LABELS, SLOT_ORDER } from "@/lib/sample-data";
import { budgetWarning, checkDay, dayCost } from "@/lib/rules";
import type { Slot } from "@/lib/types";
import { usePlan } from "./PlanProvider";
import SwapDialog from "./SwapDialog";

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export default function DayCard({ date }: { date: string }) {
  const { days, swap } = usePlan();
  const [target, setTarget] = useState<{ slot: Slot; index: number } | null>(null);
  const [message, setMessage] = useState("");

  const day = days.find((d) => d.date === date);
  if (!day) return null;

  const problems = checkDay(day);
  const warning = budgetWarning(day);
  const current = target ? day.slots[target.slot][target.index] : null;

  return (
    <section className="rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">{prettyDate(day.date)}</h2>
        <p className="text-lg">Estimated cost: <strong>S${dayCost(day).toFixed(2)}</strong> <span className="text-stone-500">(estimate, about S${(dayCost(day) / 8).toFixed(2)} per person)</span></p>
      </div>

      <p className={`mt-2 rounded-lg px-3 py-2 text-base font-medium ${problems.length ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>
        {problems.length ? problems.map((p) => p.message).join(" ") : "✓ Meal rules passed for this day"}
      </p>
      {warning && <p className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">{warning}</p>}

      <div className="mt-4 space-y-4">
        {SLOT_ORDER.map((slot) => (
          <div key={slot}>
            <h3 className="text-lg font-semibold text-emerald-800">{SLOT_LABELS[slot]}</h3>
            <ul className="mt-1 space-y-1">
              {day.slots[slot].map((r, index) => (
                <li key={r.recipe_id} className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 py-2">
                  <span className="text-lg">
                    {r.name} <span className="text-sm text-stone-500">· {r.cuisine}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {r.steps ? (
                      <Link href={`/cook/${r.recipe_id}`} className="rounded-lg bg-emerald-700 px-4 py-2 text-base font-semibold text-white">
                        Cook
                      </Link>
                    ) : (
                      <span className="text-sm text-stone-500">Recipe coming soon</span>
                    )}
                    <button
                      onClick={() => { setMessage(""); setTarget({ slot, index }); }}
                      className="rounded-lg border-2 border-emerald-700 px-4 py-2 text-base font-semibold text-emerald-800"
                    >
                      Change
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {target && current && (
        <SwapDialog
          date={date}
          allDays={days}
          current={current}
          message={message}
          onClose={() => setTarget(null)}
          onPick={(recipe) => {
            const result = swap(date, target.slot, target.index, recipe);
            if (result.ok) setTarget(null);
            else setMessage(result.message);
          }}
        />
      )}
    </section>
  );
}
