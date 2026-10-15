"use client";

import { useState } from "react";
import Link from "next/link";
import { useExtras } from "@/components/ExtrasProvider";
import { PLAN_START, baselinePlan, todaySG } from "@/lib/plan-data";
import type { Slot } from "@/lib/types";

const FIRST = PLAN_START;
const LAST = baselinePlan[baselinePlan.length - 1].date;
const pretty = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/** "Add to meal plan": pick a date, lunch or dinner, and how many people. */
export default function AddToPlan({ recipeId, servings, startOpen = false, onDone }: { recipeId: string; servings: number; startOpen?: boolean; onDone?: (message?: string) => void }) {
  const { add } = useExtras();
  const today = todaySG();
  const [open, setOpen] = useState(startOpen);
  const [date, setDate] = useState(today >= FIRST && today <= LAST ? today : FIRST);
  const [slot, setSlot] = useState<Slot>("dinner");
  const [people, setPeople] = useState(servings);
  const [done, setDone] = useState("");

  if (!open) {
    return (
      <div className="space-y-2">
      {done && <AddedNotice message={done} />}
      <button onClick={() => { setOpen(true); setDone(""); setPeople(servings); }} className="no-print rounded-full border-2 border-emerald-600 bg-emerald-50 px-5 py-3 text-lg font-semibold text-emerald-900">
        📅 Add to meal plan
      </button>
      </div>
    );
  }
  return (
    <div className="no-print space-y-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4">
      <p className="text-xl font-bold text-emerald-900">Add to the meal plan 📅</p>
      <label className="block text-lg font-semibold">
        Date
        <input type="date" min={FIRST} max={LAST} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-3 text-lg" />
      </label>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Meal">
        <span className="text-lg font-semibold">Meal:</span>
        {(["lunch", "dinner"] as Slot[]).map((s) => (
          <button key={s} onClick={() => setSlot(s)} aria-pressed={slot === s} className={`rounded-full px-5 py-3 text-lg font-semibold ${slot === s ? "bg-emerald-600 text-white" : "bg-white"}`}>{s === "lunch" ? "Lunch 午餐" : "Dinner 晚餐"}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="People">
        <span className="text-lg font-semibold">People:</span>
        {[2, 4, 6, 8].map((n) => (
          <button key={n} onClick={() => setPeople(n)} aria-pressed={people === n} className={`rounded-full px-4 py-3 text-lg font-semibold ${people === n ? "bg-emerald-600 text-white" : "bg-white"}`}>{n}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={!date || date < FIRST || date > LAST}
          onClick={() => { add({ date, slot, recipeId, servings: people }); const msg = `Added to ${pretty(date)} ${slot} for ${people} people.`; setDone(msg); setOpen(false); onDone?.(msg); }}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-lg font-semibold text-white disabled:opacity-40"
        >
          Add
        </button>
        <button onClick={() => { setOpen(false); onDone?.(); }} className="rounded-xl bg-white px-6 py-3 text-lg font-semibold">Cancel</button>
      </div>
      <p className="text-sm text-stone-600">Dates from {pretty(FIRST)} to {pretty(LAST)}.</p>
    </div>
  );
}

export function AddedNotice({ message }: { message: string }) {
  return <p className="rounded-xl bg-emerald-100 px-4 py-3 text-lg font-semibold text-emerald-900">✓ {message} <Link href="/planner" className="underline">See the meal plan</Link></p>;
}
