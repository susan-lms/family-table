import Link from "next/link";
import { SLOT_LABELS, SLOT_ORDER } from "@/lib/sample-data";
import { budgetWarning, checkDay, dayCost } from "@/lib/rules";
import type { PlannedDay } from "@/lib/types";

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export default function DayCard({ day }: { day: PlannedDay }) {
  const problems = checkDay(day);
  const warning = budgetWarning(day);
  return (
    <section className="rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">{prettyDate(day.date)}</h2>
        <p className="text-lg">Estimated cost: <strong>S${dayCost(day).toFixed(2)}</strong> <span className="text-stone-500">(sample)</span></p>
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
              {day.slots[slot].map((r) => (
                <li key={r.recipe_id} className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 py-2">
                  <span className="text-lg">
                    {r.name} <span className="text-sm text-stone-500">· {r.cuisine}</span>
                  </span>
                  {r.steps ? (
                    <Link href={`/cook/${r.recipe_id}`} className="rounded-lg bg-emerald-700 px-4 py-2 text-base font-semibold text-white">
                      Cook
                    </Link>
                  ) : (
                    <span className="text-sm text-stone-500">Recipe coming soon</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
