"use client";

import { useState } from "react";
import Link from "next/link";
import { buildShoppingList, formatQty } from "@/lib/shopping";
import { sampleDays } from "@/lib/sample-data";

export default function Shopping() {
  const [selected, setSelected] = useState<string[]>(sampleDays.map((d) => d.date));
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const days = sampleDays.filter((d) => selected.includes(d.date));
  const { items, recipesWithoutDetails } = buildShoppingList(days);
  const categories = [...new Set(items.map((i) => i.category))];

  const toggleDay = (date: string) =>
    setSelected((s) => (s.includes(date) ? s.filter((x) => x !== date) : [...s, date]));

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Shopping list</h1>
      <p className="text-lg">Quantities are for 8 people. Choose the days to shop for:</p>
      <div className="flex flex-wrap gap-3">
        {sampleDays.map((d) => (
          <label key={d.date} className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-3 text-lg">
            <input type="checkbox" className="h-6 w-6" checked={selected.includes(d.date)} onChange={() => toggleDay(d.date)} />
            {d.date}
          </label>
        ))}
      </div>

      {recipesWithoutDetails.length > 0 && (
        <p className="rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">
          Not included yet (no ingredient list written): {recipesWithoutDetails.join(", ")}.
        </p>
      )}

      {items.length === 0 && <p className="text-lg text-stone-600">Nothing to buy yet. Pick a day above.</p>}

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
                      {i.name} — <strong>{formatQty(i.qty, i.unit)}</strong>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <Link href="/" className="inline-block text-lg font-semibold text-emerald-800 underline">Back to today</Link>
    </div>
  );
}
