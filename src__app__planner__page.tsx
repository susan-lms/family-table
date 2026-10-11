"use client";

import DayCard from "@/components/DayCard";
import { usePlan } from "@/components/PlanProvider";
import { checkNoRepeat } from "@/lib/rules";

export default function Planner() {
  const { days, reset, changed } = usePlan();
  const repeats = checkNoRepeat(days);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Weekly planner</h1>
      <p className="rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">
        Prototype: only 2 sample days so far. Your changes are saved on this device only.
      </p>
      <p className={`rounded-lg px-3 py-2 text-base font-medium ${repeats.length ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>
        {repeats.length ? repeats.map((p) => p.message).join(" ") : "✓ 14-day no-repeat rule passed for these days"}
      </p>
      {changed && (
        <button onClick={reset} className="rounded-xl bg-stone-200 px-5 py-3 text-lg font-semibold">
          Undo all my changes
        </button>
      )}
      {days.map((d) => <DayCard key={d.date} date={d.date} />)}
    </div>
  );
}
