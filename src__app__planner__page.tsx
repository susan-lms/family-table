"use client";

import { useState } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import DayCard from "@/components/DayCard";
import RangeCalendar from "@/components/RangeCalendar";
import { useExtras } from "@/components/ExtrasProvider";
import { findRecipe } from "@/lib/sample-data";
import { SLOT_LABELS } from "@/lib/sample-data";
import { usePlan } from "@/components/PlanProvider";
import { PLAN_START, todaySG } from "@/lib/plan-data";
import { checkNoRepeat } from "@/lib/rules";
import { FESTIVALS } from "@/lib/festivals";
import { addDays, daysBetween, makeRange, weekOf, type DateRange } from "@/lib/calendar";

const pretty = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-SG", { day: "numeric", month: "short", timeZone: "UTC" });

const MARKS: Record<string, string> = Object.fromEntries(FESTIVALS.map((f) => [f.date, f.name]));

export default function Planner() {
  const { days, reset, changed } = usePlan();
  const { extras, remove } = useExtras();
  const repeats = checkNoRepeat(days);
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const today = todaySG();

  /** Clip a range to the dates the meal plan covers. */
  const clip = (r: DateRange): DateRange => {
    const from = r.from < first ? first : r.from > last ? last : r.from;
    const to = r.to > last ? last : r.to < first ? first : r.to;
    return from <= to ? { from, to } : { from, to: from };
  };
  const startWeek = today >= first && today <= last ? weekOf(today) : weekOf(first);
  const [range, setRange] = useState<DateRange>(clip(startWeek));

  const shown = days.filter((d) => d.date >= range.from && d.date <= range.to);
  const count = daysBetween(range.from, range.to) + 1;
  const base = today >= first && today <= last ? today : first;
  const quick: Array<[string, DateRange]> = [
    ["This week 本周", weekOf(base)],
    ["Next week 下周", weekOf(addDays(base, 7))],
    ["Next 7 days", makeRange(base, addDays(base, 6))],
    ["Next 14 days", makeRange(base, addDays(base, 13))],
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-emerald-700">📅 Meal plan 菜单</h1>
      <p className="text-lg">Choose the dates you want on the calendar. Lunch is for 4, dinner for 8 with a soup every night, from {pretty(PLAN_START)}. Your changes are saved on this device only.</p>

      <RangeCalendar min={first} max={last} today={today} value={range} onChange={(r) => setRange(clip(r))} marks={MARKS} />

      <div className="no-print flex flex-wrap gap-2">
        {quick.map(([label, r]) => (
          <button key={label} onClick={() => setRange(clip(r))} className="rounded-full bg-emerald-100 px-4 py-3 text-lg font-semibold text-emerald-900 hover:bg-emerald-200">{label}</button>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-emerald-100 to-lime-100 p-4">
        <p className="text-xl font-bold text-emerald-900">{pretty(range.from)}{range.to !== range.from ? ` to ${pretty(range.to)}` : ""} · {count} day{count === 1 ? "" : "s"}</p>
        <div className="no-print mt-3 flex flex-wrap gap-2">
          <Link href={`/shopping?from=${range.from}&to=${range.to}`} className="rounded-xl bg-orange-500 px-5 py-3 text-lg font-semibold text-white">🛒 Shopping list for these dates</Link>
          <PrintButton />
        </div>
      </div>

      <p className={`rounded-lg px-3 py-2 text-base font-medium ${repeats.length ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>
        {repeats.length ? repeats.map((p) => p.message).join(" ") : `✓ 14-day no-repeat rule passed for all ${days.length} days`}
      </p>
      {changed && (
        <button onClick={reset} className="no-print rounded-xl bg-stone-200 px-5 py-3 text-lg font-semibold">
          Undo all my changes
        </button>
      )}

      {shown.map((d) => {
        const mine = extras.filter((x) => x.date === d.date);
        return (
          <div key={d.date} className="space-y-2">
            <DayCard date={d.date} />
            {mine.length > 0 && (
              <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-4">
                <p className="text-lg font-bold text-orange-800">⭐ Added by you</p>
                <ul className="mt-1">
                  {mine.map((x) => {
                    const r = findRecipe(x.recipeId);
                    return (
                      <li key={x.uid} className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 py-2 text-lg">
                        <span>
                          <span className="text-base font-semibold text-orange-900">{SLOT_LABELS[x.slot] ?? x.slot} · {x.servings} people</span>{" "}
                          {r ? <Link href={`/cook/${r.recipe_id}?for=${x.servings}`} className="font-semibold underline">{r.name}{r.name_zh ? ` ${r.name_zh}` : ""}</Link> : x.recipeId}
                        </span>
                        <button onClick={() => remove(x.uid)} className="no-print rounded-xl border-2 border-stone-300 bg-white px-4 py-2 text-base font-semibold">Remove</button>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-1 text-sm text-stone-600">Added dishes are not checked by the meal rules (14-day no-repeat, salt and so on). They are included in the shopping list.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
