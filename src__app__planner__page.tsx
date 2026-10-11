"use client";

import { useState } from "react";
import PrintButton from "@/components/PrintButton";
import DayCard from "@/components/DayCard";
import { usePlan } from "@/components/PlanProvider";
import { PLAN_START, todaySG } from "@/lib/plan-data";
import { checkNoRepeat } from "@/lib/rules";

const pretty = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-SG", { day: "numeric", month: "short", timeZone: "UTC" });

export default function Planner() {
  const { days, reset, changed } = usePlan();
  const repeats = checkNoRepeat(days);
  const weeks = Math.ceil(days.length / 7);
  const todayIdx = days.findIndex((d) => d.date === todaySG());
  const [week, setWeek] = useState(todayIdx >= 0 ? Math.floor(todayIdx / 7) : 0);
  const shown = days.slice(week * 7, week * 7 + 7);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Weekly planner 每周菜单</h1>
      <PrintButton />
      <p className="text-lg">90-day plan from {pretty(PLAN_START)}: lunch for 4, dinner for 8 with a soup every night. Quick one-pot dinners on Mon, Wed and Fri. Your changes are saved on this device only.</p>
      <p className={`rounded-lg px-3 py-2 text-base font-medium ${repeats.length ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>
        {repeats.length ? repeats.map((p) => p.message).join(" ") : `✓ 14-day no-repeat rule passed for all ${days.length} days`}
      </p>
      {changed && (
        <button onClick={reset} className="no-print rounded-xl bg-stone-200 px-5 py-3 text-lg font-semibold">
          Undo all my changes
        </button>
      )}

      <div className="no-print flex items-center justify-between gap-3">
        <button className="rounded-xl bg-stone-200 px-4 py-3 text-lg font-semibold disabled:opacity-40" disabled={week === 0} onClick={() => setWeek(week - 1)}>← Earlier</button>
        <p className="text-lg font-semibold">Week {week + 1} of {weeks}</p>
        <button className="rounded-xl bg-stone-200 px-4 py-3 text-lg font-semibold disabled:opacity-40" disabled={week >= weeks - 1} onClick={() => setWeek(week + 1)}>Later →</button>
      </div>

      {shown.map((d) => <DayCard key={d.date} date={d.date} />)}
    </div>
  );
}
