"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { catalog, EXCLUDED_CUISINES } from "@/lib/sample-data";
import { CUISINES, MEAT_CHIPS, TIME_OPTIONS, TYPES, emojiOf, fmtMinutes, originOf, totalMinutes } from "@/lib/browse";
import { mainProtein } from "@/lib/protein";
import { isSoft } from "@/lib/softness";
import { HeartButton } from "@/components/FavouritesProvider";
import { Thumb } from "@/components/PhotosProvider";

const PAGE = 24;

const chip = (on: boolean) =>
  `rounded-full px-4 py-3 text-lg font-semibold ${on ? "bg-emerald-700 text-white" : "bg-stone-200 text-stone-900"}`;

export default function RecipeBook() {
  const [cuisine, setCuisine] = useState("all");
  const [type, setType] = useState("all");
  const [meat, setMeat] = useState("all");
  const [pieKind, setPieKind] = useState("all");
  const [time, setTime] = useState<(typeof TIME_OPTIONS)[number]["id"]>("any");
  const [softOnly, setSoftOnly] = useState(false);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const pool = useMemo(() => catalog.filter((r) => !EXCLUDED_CUISINES.includes(r.cuisine)), []);
  const cuisineTest = CUISINES.find((c) => c.id === cuisine)!.test;
  const typeTest = TYPES.find((t) => t.id === type)!.test;
  const maxMin = TIME_OPTIONS.find((t) => t.id === time)!.max;
  const needle = q.trim().toLowerCase();

  const shown = useMemo(
    () =>
      pool
        .filter(
          (r) =>
            cuisineTest(r) &&
            typeTest(r) &&
            (type !== "meat" || meat === "all" || mainProtein(r) === meat) &&
            (type !== "pie" || pieKind === "all" || (pieKind === "sweet") === !!r.sweet) &&
            totalMinutes(r) <= maxMin &&
            (!softOnly || isSoft(r)) &&
            (needle === "" || r.name.toLowerCase().includes(needle) || (r.name_zh ?? "").includes(q.trim())),
        )
        .sort((a, b) => totalMinutes(a) - totalMinutes(b) || a.name.localeCompare(b.name)),
    [pool, cuisineTest, typeTest, type, meat, pieKind, maxMin, softOnly, needle, q],
  );

  const reset = () => setLimit(PAGE);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold">Family Table recipes 家常食谱</h1>
        <p className="mt-1 text-lg text-stone-700">Pick a cuisine and a type of dish. Every recipe is written to be gentle on salt, sugar and oil.</p>
      </header>

      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); reset(); }}
        placeholder="Search a dish, e.g. fish, 豆腐"
        aria-label="Search recipes"
        className="w-full rounded-xl border-2 border-stone-300 px-4 py-3 text-lg"
      />

      <section aria-label="Cuisine">
        <h2 className="mb-2 text-xl font-semibold text-emerald-800">1. Choose a cuisine 菜系</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CUISINES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCuisine(c.id); reset(); }}
              aria-pressed={cuisine === c.id}
              className={`rounded-2xl border-2 px-3 py-3 text-left ${cuisine === c.id ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-300 bg-white"}`}
            >
              <span className="block text-2xl">{c.emoji}</span>
              <span className="block text-lg font-semibold leading-tight">{c.label}</span>
              <span className="block text-base opacity-80">{c.zh}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Type of dish">
        <h2 className="mb-2 text-xl font-semibold text-emerald-800">2. Choose a type of dish 菜式</h2>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => { setType(t.id); setMeat("all"); setPieKind("all"); reset(); }} aria-pressed={type === t.id} className={chip(type === t.id)}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        {type === "meat" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {["all", ...MEAT_CHIPS].map((m) => (
              <button key={m} onClick={() => { setMeat(m); reset(); }} className={chip(meat === m)}>{m === "all" ? "Any meat" : m[0].toUpperCase() + m.slice(1)}</button>
            ))}
          </div>
        )}
        {type === "pie" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[["all", "All pies"], ["savoury", "Savoury"], ["sweet", "Sweet"]].map(([id, label]) => (
              <button key={id} onClick={() => { setPieKind(id); reset(); }} className={chip(pieKind === id)}>{label}</button>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-3" aria-label="Filters">
        <span className="text-lg font-semibold">Cooking time:</span>
        {TIME_OPTIONS.map((t) => (
          <button key={t.id} onClick={() => { setTime(t.id); reset(); }} aria-pressed={time === t.id} className={chip(time === t.id)}>{t.label}</button>
        ))}
        <label className="flex cursor-pointer items-center gap-2 text-lg">
          <input type="checkbox" className="h-6 w-6" checked={softOnly} onChange={(e) => { setSoftOnly(e.target.checked); reset(); }} />
          Soft for seniors
        </label>
      </section>

      <p className="text-lg font-semibold" role="status">{shown.length} recipe{shown.length === 1 ? "" : "s"}</p>

      {shown.length === 0 && (
        <p className="rounded-xl bg-amber-100 px-4 py-3 text-lg text-amber-900">
          No recipes match. Try another cuisine or type of dish, or choose “Any time”.
        </p>
      )}

      <ul className="space-y-3">
        {shown.slice(0, limit).map((r) => (
          <li key={r.recipe_id}>
            <Link href={`/cook/${r.recipe_id}?for=4`} className="flex items-start gap-3 rounded-2xl border border-stone-300 bg-white p-4 shadow-sm">
              <Thumb id={r.recipe_id} emoji={emojiOf(r)} />
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold leading-snug">{r.name}</span>
                {r.name_zh && <span className="block text-lg text-stone-700">{r.name_zh}</span>}
                <span className="mt-1 flex flex-wrap gap-2 text-base">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900">⏱ {fmtMinutes(totalMinutes(r))}</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1">{originOf(r)}</span>
                  {r.dish_class !== "soup" && r.dish_class !== "vegetable" && r.dish_class !== "pie" && r.dish_class !== "salad" && <span className="rounded-full bg-stone-100 px-3 py-1">{mainProtein(r)}</span>}
                  {r.sweet && <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-900">sweet</span>}
                  {isSoft(r) && <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-900">soft</span>}
                </span>
              </span>
              <HeartButton id={r.recipe_id} servings={4} />
            </Link>
          </li>
        ))}
      </ul>

      {shown.length > limit && (
        <button onClick={() => setLimit(limit + PAGE)} className="w-full rounded-xl bg-emerald-700 px-4 py-4 text-xl font-semibold text-white">
          Show more ({shown.length - limit} left)
        </button>
      )}

      <p className="text-sm text-stone-500">Sample recipes written for this app. Not yet taste-tested. Chinese names are not yet checked by a native speaker.</p>
    </div>
  );
}
