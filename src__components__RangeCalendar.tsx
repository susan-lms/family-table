"use client";

import { useState } from "react";
import { addMonths, makeRange, monthGrid, monthOf, type DateRange } from "@/lib/calendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthName = (m: string) => new Date(m + "-01T00:00:00Z").toLocaleDateString("en-SG", { month: "long", year: "numeric", timeZone: "UTC" });

/**
 * A month calendar: tap a first date, then a last date. Only dates inside min..max can be chosen
 * (the meal plan covers those dates). Dates in `marks` get a small dot (festival dinners).
 */
export default function RangeCalendar({
  min, max, today, value, onChange, marks = {},
}: {
  min: string; max: string; today: string; value: DateRange; onChange: (r: DateRange) => void; marks?: Record<string, string>;
}) {
  const [month, setMonth] = useState(monthOf(value.from));
  const [anchor, setAnchor] = useState<string | null>(null); // first tap, waiting for the second

  const tap = (d: string) => {
    if (anchor === null) { setAnchor(d); onChange({ from: d, to: d }); }
    else { onChange(makeRange(anchor, d)); setAnchor(null); }
  };

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <button className="rounded-xl bg-emerald-100 px-4 py-2 text-xl font-bold text-emerald-900 disabled:opacity-30" disabled={monthOf(min) >= month} onClick={() => setMonth(addMonths(month, -1))} aria-label="Earlier month">◀</button>
        <p className="text-xl font-bold text-emerald-800">{monthName(month)}</p>
        <button className="rounded-xl bg-emerald-100 px-4 py-2 text-xl font-bold text-emerald-900 disabled:opacity-30" disabled={monthOf(max) <= month} onClick={() => setMonth(addMonths(month, 1))} aria-label="Later month">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-bold text-stone-600">
        {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {monthGrid(month).map((d, k) => {
          if (!d) return <span key={k} />;
          const disabled = d < min || d > max;
          const isEnd = d === value.from || d === value.to;
          const inside = d > value.from && d < value.to;
          const cls = disabled
            ? "text-stone-300"
            : isEnd ? "bg-emerald-600 text-white"
            : inside ? "bg-emerald-200 text-emerald-950"
            : "bg-stone-50 text-stone-900 hover:bg-emerald-100";
          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => tap(d)}
              aria-pressed={isEnd || inside}
              aria-label={d}
              title={marks[d]}
              className={`relative h-12 rounded-lg text-lg font-semibold ${cls} ${d === today ? "ring-2 ring-orange-500" : ""}`}
            >
              {Number(d.slice(8))}
              {marks[d] && <span className="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rose-500" aria-hidden />}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-base text-stone-700">
        {anchor ? "Now tap the last date." : "Tap the first date, then the last date."}{" "}
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden /> festival dinner · <span className="rounded px-1 ring-2 ring-orange-500">today</span>
      </p>
    </div>
  );
}
