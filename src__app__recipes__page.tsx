"use client";

import { useState } from "react";
import Link from "next/link";
import { library } from "@/lib/sample-data";
import { CLASS_LABELS, estimatedGapDays, generatePlan, libraryStatus } from "@/lib/generator";
import { isCalciumRich } from "@/lib/nutrition";
import { isSoft } from "@/lib/softness";
import { PROTEIN_TYPES, mainProtein } from "@/lib/protein";

const TYPES = ["all", "onedish", "onepot", "protein", "vegetable", "soup"] as const;
const STYLES = ["All styles", "porridge", "noodles", "sandwich"] as const;
const CUISINES = ["All", "Chinese", "Western", "Japanese", "Korean", "Fusion", "Spanish", "Thai", "Indonesian", "Malaysian"];
const GOAL_GAP_DAYS = 60;

export default function Recipes() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [cuisine, setCuisine] = useState("All");
  const [meat, setMeat] = useState("All");
  const [softOnly, setSoftOnly] = useState(false);
  const [style, setStyle] = useState<(typeof STYLES)[number]>("All styles");

  const status = libraryStatus(library);
  const totalHave = status.reduce((s, x) => s + x.have, 0);
  const totalNeed = status.reduce((s, x) => s + x.need, 0);
  const ready = status.every((x) => x.have >= x.need);
  const trial = generatePlan({ startDate: "2026-10-12", days: 90, library });
  const gap = estimatedGapDays(library);
  const gapPct = Math.min(100, Math.round((gap.days / GOAL_GAP_DAYS) * 100));
  const withSteps = library.filter((r) => r.steps).length;

  const shown = library.filter(
    (r) =>
      (type === "all" || r.dish_class === type) &&
      (cuisine === "All" || r.cuisine === cuisine) &&
      (meat === "All" || mainProtein(r) === meat) &&
      (!softOnly || isSoft(r)) &&
      (style === "All styles" || r.meal === style) &&
      (r.name.toLowerCase().includes(q.trim().toLowerCase()) || (r.name_zh ?? "").includes(q.trim())),
  );

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Recipes</h1>

      <section className="rounded-2xl border border-stone-300 bg-white p-5">
        <h2 className="text-xl font-bold">Is there enough for 90 days of lunch and dinner?</h2>
        <p className="mt-1 text-lg">
          A dish can&apos;t come back within 14 days. So we need at least <strong>{totalNeed}</strong> different dishes. We have <strong>{totalHave}</strong>.
        </p>
        <ul className="mt-3 space-y-3">
          {status.map((s) => {
            const pct = Math.min(100, Math.round((s.have / s.need) * 100));
            return (
              <li key={s.dishClass}>
                <p className="text-lg">
                  {s.label}: <strong>{s.have}</strong> of {s.need} needed
                  {s.have >= s.need ? " ✓" : ` — ${s.need - s.have} more to write`}
                </p>
                <div className="h-4 w-full overflow-hidden rounded-full bg-stone-200">
                  <div className={`h-4 ${s.have >= s.need ? "bg-emerald-600" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4">
          <p className="text-lg">
            How long before a dish comes back: about <strong>{gap.days} days</strong> now. Your goal is {GOAL_GAP_DAYS} days.
          </p>
          <div className="h-4 w-full overflow-hidden rounded-full bg-stone-200">
            <div className="h-4 bg-emerald-600" style={{ width: `${gapPct}%` }} />
          </div>
          <p className="mt-1 text-base text-stone-600">
            The smallest group is <strong>{gap.limitedBy.toLowerCase()}</strong>. The 14-day rule is always kept. Adding more dishes stretches the gap.
          </p>
          <p className="mt-1 text-base text-stone-600">{withSteps} of {library.length} dishes have full cooking steps.</p>
        </div>
        <p className={`mt-4 rounded-lg px-3 py-2 text-base font-medium ${ready ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
          {ready
            ? "✓ Enough dishes to build 90 days."
            : `Not ready yet. With today's dishes, the plan can safely fill ${trial.days.length} of 90 days.`}
        </p>
      </section>

      <section className="space-y-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name 搜索"
          aria-label="Search recipes by name"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-lg"
        />
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-2 text-base font-semibold ${type === t ? "bg-emerald-700 text-white" : "bg-stone-200"}`}
            >
              {t === "all" ? "All types" : CLASS_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`rounded-full px-4 py-2 text-base font-semibold ${cuisine === c ? "bg-emerald-700 text-white" : "bg-stone-200"}`}
            >
              {c === "All" ? "All cuisines" : c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...PROTEIN_TYPES].map((m) => (
            <button
              key={m}
              onClick={() => setMeat(m)}
              className={`rounded-full px-4 py-2 text-base font-semibold ${meat === m ? "bg-emerald-700 text-white" : "bg-stone-200"}`}
            >
              {m === "All" ? "Any meat or fish" : m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((m) => (
            <button
              key={m}
              onClick={() => setStyle(m)}
              className={`rounded-full px-4 py-2 text-base font-semibold ${style === m ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-900"}`}
            >
              {m === "All styles" ? "All styles" : m === "porridge" ? "Porridge 粥" : m === "noodles" ? "Noodles 面/粉" : "Sandwich / wrap"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSoftOnly(!softOnly)}
          aria-pressed={softOnly}
          className={`rounded-full px-4 py-2 text-base font-semibold ${softOnly ? "bg-sky-700 text-white" : "bg-sky-100 text-sky-900"}`}
        >
          Soft dishes only (easy to chew)
        </button>
        <p className="text-base text-stone-600">Showing {shown.length} of {library.length} dishes</p>
      </section>

      {shown.length === 0 && <p className="text-lg text-stone-600">No dishes match. Try clearing the search or filters.</p>}

      <ul className="space-y-2">
        {shown.map((r) => (
          <li key={r.recipe_id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3">
            <span>
              <span className="block text-lg font-semibold">{r.name} {r.name_zh}{isSoft(r) ? " · Soft" : ""}{isCalciumRich(r) ? " · Calcium" : ""}{r.treat ? " · Treat" : ""}</span>
              <span className="block text-base text-stone-600">
                {r.cuisine} · {CLASS_LABELS[r.dish_class]} · {mainProtein(r)} · Prep {r.prep_time_minutes} min · Cook {r.cook_time_minutes} min
              </span>
            </span>
            {r.steps ? (
              <Link href={`/cook/${r.recipe_id}`} className="rounded-lg bg-emerald-700 px-4 py-2 text-base font-semibold text-white">View</Link>
            ) : (
              <span className="text-sm text-stone-500">Steps coming soon</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
