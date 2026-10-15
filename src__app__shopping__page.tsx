"use client";

import { useState } from "react";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";
import { buildShoppingList, formatQty } from "@/lib/shopping";
import { ingredientZh } from "@/lib/zh-ingredients";
import { todaySG } from "@/lib/plan-data";
import { usePlan } from "@/components/PlanProvider";

export default function Shopping() {
  const { days: planDays } = usePlan();
  const todayIdx = Math.max(0, planDays.findIndex((d) => d.date === todaySG()));
  const [count, setCount] = useState(3);
  const [from, setFrom] = useState(todayIdx);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const days = planDays.slice(from, from + count);
  const { items, recipesWithoutDetails } = buildShoppingList(days);
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Shopping list 购物清单</h1>
      <PrintButton />
      <p className="text-lg">Quantities are for 8 people. How many days do you want to shop for?</p>
      <div className="no-print flex flex-wrap gap-2">
        {[1, 3, 7, 14].map((n) => (
          <button key={n} onClick={() => setCount(n)} className={`rounded-full px-5 py-3 text-lg font-semibold ${count === n ? "bg-emerald-700 text-white" : "bg-stone-200"}`}>
            {n === 1 ? "1 day" : `${n} days`}
          </button>
        ))}
      </div>
      {days.length > 0 && (
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
