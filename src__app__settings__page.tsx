"use client";

import { useState } from "react";
import { DEFAULT_SETTINGS, usePlan } from "@/components/PlanProvider";

const DAYS = [
  { n: 1, label: "Mon" }, { n: 2, label: "Tue" }, { n: 3, label: "Wed" }, { n: 4, label: "Thu" }, { n: 5, label: "Fri" }, { n: 6, label: "Sat" }, { n: 0, label: "Sun" },
];

function Picker({ title, help, value, onChange }: { title: string; help: string; value: number[]; onChange: (v: number[]) => void }) {
  return (
    <section className="rounded-2xl border border-stone-300 bg-white p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-base text-stone-700">{help}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DAYS.map((d) => {
          const on = value.includes(d.n);
          return (
            <button key={d.n} aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== d.n) : [...value, d.n])}
              className={`rounded-full px-5 py-3 text-lg font-semibold ${on ? "bg-emerald-700 text-white" : "bg-stone-200"}`}>
              {d.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function Settings() {
  const { settings, applySettings } = usePlan();
  const [quick, setQuick] = useState(settings.quickWeekdays);
  const [free, setFree] = useState(settings.meatFreeWeekdays);
  const [lunchOne, setLunchOne] = useState(settings.lunchOneDishWeekdays);
  const [noodles, setNoodles] = useState(settings.noodleDinnerWeekdays);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Weekly pattern 每周安排</h1>
      <Picker title="Quick one-pot dinner nights" help="Dinner is one rice-cooker or claypot meal plus a soup. Good for busy work nights." value={quick} onChange={(v) => { setQuick(v); setDone(false); }} />
      <Picker title="Meat-free days" help="No meat, fish or seafood all day. Eggs and tofu are used for protein. A meat-free day is always a normal dinner (not one-pot)." value={free} onChange={(v) => { setFree(v); setDone(false); }} />
      <Picker title="One-dish lunch days" help="Lunch is one dish for 4: a porridge (plain, fish, chicken or pork), a noodle dish or a sandwich. Other days lunch is rice with 1 meat or fish dish and 1 vegetable dish." value={lunchOne} onChange={(v) => { setLunchOne(v); setDone(false); }} />
      <Picker title="Noodle or sandwich dinner nights" help="Dinner is one noodle or sandwich dish plus the soup, with no rice. Pick the nights you want a change from rice." value={noodles} onChange={(v) => { setNoodles(v); setDone(false); }} />
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-base text-amber-900">Saving rebuilds the whole 90-day plan. Dish changes you made will be cleared.</p>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => { const r = applySettings({ quickWeekdays: quick, meatFreeWeekdays: free, lunchOneDishWeekdays: lunchOne, noodleDinnerWeekdays: noodles }); setDone(r.ok); setErr(r.ok ? "" : r.message); }} className="rounded-xl bg-emerald-700 px-6 py-4 text-xl font-semibold text-white">Save and rebuild plan</button>
        <button onClick={() => { setQuick(DEFAULT_SETTINGS.quickWeekdays); setFree(DEFAULT_SETTINGS.meatFreeWeekdays); setLunchOne(DEFAULT_SETTINGS.lunchOneDishWeekdays); setNoodles(DEFAULT_SETTINGS.noodleDinnerWeekdays); setDone(false); }} className="rounded-xl bg-stone-200 px-6 py-4 text-xl font-semibold">Back to the usual</button>
      </div>
      {err && <p className="rounded-lg bg-red-100 px-3 py-2 text-lg font-medium text-red-900">{err}</p>}
      {done && <p className="rounded-lg bg-emerald-100 px-3 py-2 text-lg font-medium text-emerald-900">✓ Plan rebuilt. Check the Week page.</p>}
    </div>
  );
}
