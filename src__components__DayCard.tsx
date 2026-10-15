"use client";

import { useState } from "react";
import Link from "next/link";
import { SLOT_LABELS, SLOT_ORDER } from "@/lib/sample-data";
import { fruitFor, dayProteinPerPerson, isCalciumRich, SENIOR_PROTEIN_GOAL, CALCIUM_NOTE } from "@/lib/nutrition";
import { avoidWarnings } from "@/lib/people";
import { usePeople } from "./PeopleProvider";
import { isMeatFreeDay } from "@/lib/servings";
import { SLOT_SERVINGS } from "@/lib/servings";
import { mainProtein } from "@/lib/protein";
import { isSoft } from "@/lib/softness";
import { SODIUM_LIMIT_MG, daySodiumPerPerson } from "@/lib/sodium";
import { budgetWarning, checkDay, dayCost, slotCost } from "@/lib/rules";
import type { Slot } from "@/lib/types";
import { usePlan } from "./PlanProvider";
import SwapDialog from "./SwapDialog";

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export default function DayCard({ date }: { date: string }) {
  const { days, swap, changeDinnerMode, changeLunchMode, settings } = usePlan();
  const { people } = usePeople();
  const [target, setTarget] = useState<{ slot: Slot; index: number } | null>(null);
  const [message, setMessage] = useState("");

  const day = days.find((d) => d.date === date);
  if (!day) return null;

  const problems = checkDay(day);
  const warning = budgetWarning(day);
  const salt = Math.round(daySodiumPerPerson(day));
  const saltLevel = salt > SODIUM_LIMIT_MG ? "red" : salt > 1330 ? "amber" : "green";
  const protein = dayProteinPerPerson(day);
  const proteinLow = protein.both < SENIOR_PROTEIN_GOAL.low;
  const fruit = fruitFor(day.date);
  const calciumDishes = [...day.slots.lunch, ...day.slots.dinner].filter(isCalciumRich).length;
  const warnings = avoidWarnings(day, people);
  const isQuick = day.slots.dinner.some((r) => r.dish_class === "onepot");
  const isNoodleNight = day.slots.dinner.some((r) => r.dish_class === "onedish");
  const isOneDishLunch = day.slots.lunch.some((r) => r.dish_class === "onedish");
  const meatFree = isMeatFreeDay(day.date, settings.meatFreeWeekdays);
  const current = target ? day.slots[target.slot][target.index] : null;

  return (
    <section className="print-card rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">
          {prettyDate(day.date)}
          {isQuick && (
            <span className="ml-2 rounded-full bg-amber-100 px-3 py-1 align-middle text-base font-semibold text-amber-900">Quick night</span>
          )}
          {isNoodleNight && (
            <span className="ml-2 rounded-full bg-indigo-100 px-3 py-1 align-middle text-base font-semibold text-indigo-900">Non-rice night</span>
          )}
        </h2>
        <p className="text-lg">Estimated cost: <strong>S${dayCost(day).toFixed(2)}</strong> <span className="text-stone-500">(estimate)</span></p>
      </div>

      <p className={`mt-2 rounded-lg px-3 py-2 text-base font-medium ${problems.length ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>
        {problems.length ? problems.map((p) => p.message).join(" ") : "✓ Meal rules passed for this day"}
      </p>
      {warning && <p className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">{warning}</p>}
      <p className={`mt-2 rounded-lg px-3 py-2 text-base ${saltLevel === "red" ? "bg-red-100 text-red-900" : saltLevel === "amber" ? "bg-amber-100 text-amber-900" : "bg-emerald-50 text-emerald-900"}`}>
        Salt check: about <strong>{salt} mg sodium</strong> per person from the planned dishes (daily limit {SODIUM_LIMIT_MG} mg, from HPB).
        {saltLevel === "green" ? " Good." : saltLevel === "amber" ? " A bit high: go easy on table sauces today." : " Over the limit: swap a dish."}{" "}
        <span className="text-sm">Estimate. Table sauces, snacks and other meals are not counted.</span>
      </p>

      {meatFree && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-base font-semibold text-emerald-900">🌱 Meat-free day: eggs and tofu for protein.</p>}
      {warnings.length > 0 && (
        <div className="mt-2 rounded-lg border-2 border-red-300 bg-red-50 px-3 py-2 text-base text-red-900">
          <p className="font-semibold">⚠ Check family notes:</p>
          <ul className="list-disc pl-5">{warnings.map((w, k) => <li key={k}>{w.person} avoids &quot;{w.word}&quot; — in {w.dish}</li>)}</ul>
        </div>
      )}
      <p className={`mt-2 rounded-lg px-3 py-2 text-base ${proteinLow ? "bg-amber-100 text-amber-900" : "bg-emerald-50 text-emerald-900"}`}>
        Protein check: about <strong>{Math.round(protein.both)} g</strong> per person if eating lunch and dinner (<strong>{Math.round(protein.dinnerOnly)} g</strong> dinner only). Seniors need about {SENIOR_PROTEIN_GOAL.low}–{SENIOR_PROTEIN_GOAL.high} g a day.
        {proteinLow ? " A little low today: add an egg, a glass of milk or soy milk, or a bit more fish or tofu." : " Good."}{" "}
        <span className="text-sm">Estimate from the ingredients.</span>
      </p>
      <p className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-base text-stone-800" title={CALCIUM_NOTE}>
        Calcium-rich dishes today: <strong>{calciumDishes}</strong> (tofu, greens, etc.). <span className="text-sm">{CALCIUM_NOTE}</span>
      </p>

      <div className="mt-4 space-y-4">
        {SLOT_ORDER.map((slot) => (
          <div key={slot}>
            <h3 className="text-lg font-semibold text-emerald-800">
              {SLOT_LABELS[slot]} <span className="text-base font-normal text-stone-500">· S${slotCost(day, slot).toFixed(2)} estimate</span>
            </h3>
            <ul className="mt-1 space-y-1">
              {day.slots[slot].map((r, index) => (
                <li key={r.recipe_id} className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 py-2">
                  <span className="text-lg">
                    {r.name}{r.name_zh ? <span className="ml-2 text-xl font-semibold text-stone-700">{r.name_zh}</span> : null}{" "}
                    <span className="text-sm text-stone-500">
                      · {r.cuisine}
                      {r.dish_class === "protein" || r.dish_class === "onepot" || r.dish_class === "onedish" ? ` · ${mainProtein(r)}` : ""}
                      {` · ${r.prep_time_minutes + r.cook_time_minutes} min`}
                    </span>
                    {isSoft(r) && <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-sm font-semibold text-sky-900">Soft</span>}
                    {r.treat && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-sm font-semibold text-orange-900">Treat</span>}
                    {r.dish_class === "onedish" && <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-sm font-semibold text-indigo-900">{r.meal === "porridge" ? "Porridge" : r.meal === "noodles" ? "Noodles" : r.meal === "sandwich" ? "Sandwich" : "One dish"}</span>}
                    {r.dish_class === "onepot" && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-semibold text-emerald-900">One pot</span>}
                  </span>
                  <span className="no-print flex items-center gap-2">
                    {r.steps ? (
                      <Link href={`/cook/${r.recipe_id}?for=${SLOT_SERVINGS[slot]}`} className="rounded-lg bg-emerald-700 px-4 py-2 text-base font-semibold text-white">
                        Cook
                      </Link>
                    ) : (
                      <span className="text-sm text-stone-500">Recipe coming soon</span>
                    )}
                    <button
                      onClick={() => { setMessage(""); setTarget({ slot, index }); }}
                      className="rounded-lg border-2 border-emerald-700 px-4 py-2 text-base font-semibold text-emerald-800"
                    >
                      Change
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-orange-50 px-3 py-2 text-lg text-orange-900">
        🍎 After dinner: <strong>{fruit.name} {fruit.zh}</strong> — about {fruit.qty} {fruit.unit === "piece" ? "pcs" : "g"} for 8 (about S${fruit.cost.toFixed(2)}, estimate, not counted above). Soft, low sugar. Cut small for the seniors.
      </p>

      <div className="no-print mt-3 flex flex-wrap items-center gap-2">
        <span className="text-base font-semibold text-stone-700">Change the style:</span>
        <button
          onClick={() => { const r = changeLunchMode(day.date, isOneDishLunch ? "standard" : "onedish"); setMessage(r.ok ? "" : r.message); }}
          className="rounded-lg border-2 border-emerald-700 px-4 py-2 text-base font-semibold text-emerald-800"
        >
          {isOneDishLunch ? "Lunch: rice + 2 dishes" : "Lunch: porridge / noodles / sandwich"}
        </button>
        {(isQuick || isNoodleNight) && (
          <button
            onClick={() => { const r = changeDinnerMode(day.date, "full"); setMessage(r.ok ? "" : r.message); }}
            className="rounded-lg border-2 border-emerald-700 px-4 py-2 text-base font-semibold text-emerald-800"
          >
            Dinner: full (rice + 2 meat + 2 veg)
          </button>
        )}
        {!isQuick && (
          <button
            disabled={meatFree}
            onClick={() => { const r = changeDinnerMode(day.date, "quick"); setMessage(r.ok ? "" : r.message); }}
            className="rounded-lg border-2 border-emerald-700 px-4 py-2 text-base font-semibold text-emerald-800 disabled:opacity-40"
          >
            Dinner: quick one-pot rice
          </button>
        )}
        {!isNoodleNight && (
          <button
            onClick={() => { const r = changeDinnerMode(day.date, "noodle"); setMessage(r.ok ? "" : r.message); }}
            className="rounded-lg border-2 border-emerald-700 px-4 py-2 text-base font-semibold text-emerald-800"
          >
            Dinner: noodles / sandwich
          </button>
        )}
        {message && !target && <span className="w-full text-base font-medium text-red-700">{message}</span>}
      </div>

      {target && current && (
        <SwapDialog
          slot={target.slot}
          date={date}
          allDays={days}
          current={current}
          message={message}
          onClose={() => setTarget(null)}
          onPick={(recipe) => {
            const result = swap(date, target.slot, target.index, recipe);
            if (result.ok) setTarget(null);
            else setMessage(result.message);
          }}
        />
      )}
    </section>
  );
}
