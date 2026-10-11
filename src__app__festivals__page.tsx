"use client";

import { useState } from "react";
import Link from "next/link";
import { FESTIVALS, festivalDishes } from "@/lib/festivals";
import { usePlan } from "@/components/PlanProvider";
import { dayCost } from "@/lib/rules";

const pretty = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function Festivals() {
  const { days, setDinner } = usePlan();
  const [msg, setMsg] = useState<Record<string, string>>({});

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Festival menus 节日菜单</h1>
      <p className="text-lg">Each menu is a full dinner for 8: 2 meat or fish dishes, 2 vegetable dishes and a soup. Dates for Dongzhi and Chinese New Year are from publicholidays.sg.</p>
      {FESTIVALS.map((f) => {
        const dishes = festivalDishes(f);
        const day = days.find((d) => d.date === f.date);
        const used = !!day && dishes.length > 0 && dishes.every((r) => day.slots.dinner.some((x) => x.recipe_id === r.recipe_id));
        const cost = dishes.reduce((s, r) => s + r.estimated_cost_sgd, 0);
        return (
          <section key={f.id} className="rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold">{f.name} <span className="text-stone-700">{f.name_zh}</span></h2>
            <p className="text-lg font-semibold text-emerald-800">{pretty(f.date)}</p>
            <p className="mt-1 text-lg">{f.blurb}</p>
            <ul className="mt-2">
              {dishes.map((r) => (
                <li key={r.recipe_id} className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 py-2 text-lg">
                  <span>{r.name} <span className="font-semibold text-stone-700">{r.name_zh}</span></span>
                  <Link href={`/cook/${r.recipe_id}?for=8`} className="rounded-lg bg-emerald-700 px-4 py-2 text-base font-semibold text-white">Cook</Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-base text-stone-600">Dishes cost about S${cost.toFixed(2)} for 8 (estimate).</p>
            {f.extra && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-base text-amber-900">{f.extra}</p>}
            {day ? (
              <div className="mt-3">
                <button
                  disabled={used}
                  onClick={() => {
                    const r = setDinner(f.date, dishes);
                    setMsg((m) => ({ ...m, [f.id]: r.ok ? "Done. The dinner on that date is now this menu." : r.message }));
                  }}
                  className="rounded-xl bg-emerald-700 px-5 py-3 text-lg font-semibold text-white disabled:opacity-50"
                >
                  {used ? "✓ On the plan" : "Use this menu on that date"}
                </button>
                {msg[f.id] && <p className="mt-2 text-base font-medium text-stone-800">{msg[f.id]}</p>}
                {used && day && <p className="mt-1 text-base text-stone-600">Day total now about S${dayCost(day).toFixed(2)} (estimate). To undo, use &quot;Undo all my changes&quot; on the Week page.</p>}
              </div>
            ) : (
              <p className="mt-3 text-base text-stone-600">This date is after the current 90-day plan (it ends 9 Jan 2027), so the menu is for you to cook by hand.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
