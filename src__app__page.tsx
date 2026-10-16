"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { catalog, EXCLUDED_CUISINES } from "@/lib/sample-data";
import { CUISINES, MEAT_CHIPS, TIME_OPTIONS, TYPES, cuisineIdOf, emojiOf, fmtMinutes, originOf, totalMinutes } from "@/lib/browse";
import { CUISINE_TONE, TYPE_TONE } from "@/lib/theme";
import { mainProtein } from "@/lib/protein";
import { matchScore, parseQuery } from "@/lib/search";
import { isSoft } from "@/lib/softness";
import { HeartButton } from "@/components/FavouritesProvider";
import { Thumb } from "@/components/PhotosProvider";
import AddToPlan from "@/components/AddToPlan";
import { useMyRecipes } from "@/components/MyRecipesProvider";

const PAGE = 24;

/** A friendly hello that matches the time of day in Singapore. */
function greeting(): string {
  const h = Number(new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Singapore" }));
  return h < 11 ? "Good morning! 早安" : h < 15 ? "Good afternoon! 午安" : h < 19 ? "Good evening! 晚上好" : "Good evening! 晚安";
}

const chip = (on: boolean) =>
  `rounded-full px-4 py-3 text-lg font-semibold ${on ? "bg-emerald-700 text-white" : "bg-stone-200 text-stone-900"}`;
const typeChip = (id: string, on: boolean) =>
  `rounded-full border-2 px-4 py-3 text-lg font-semibold ${on ? TYPE_TONE[id].on : TYPE_TONE[id].tile}`;

export default function RecipeBook() {
  const [cuisine, setCuisine] = useState("all");
  const [type, setType] = useState("all");
  const [meat, setMeat] = useState("all");
  const [pieKind, setPieKind] = useState("all");
  const [time, setTime] = useState<(typeof TIME_OPTIONS)[number]["id"]>("any");
  const [softOnly, setSoftOnly] = useState(false);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [planFor, setPlanFor] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const { recipes: mine } = useMyRecipes(); // re-draw when the family adds or removes a recipe
  const pool = useMemo(() => catalog.filter((r) => !EXCLUDED_CUISINES.includes(r.cuisine)), [mine]);
  const parsed = useMemo(() => parseQuery(q), [q]);
  // Typing a cuisine or dish-type word (e.g. "chinese", "soup") picks that tab by itself.
  const cuisineNow = parsed.cuisineId ?? cuisine;
  const typeNow = parsed.typeId ?? type;
  const cuisineTest = CUISINES.find((c) => c.id === cuisineNow)!.test;
  const typeTest = TYPES.find((t) => t.id === typeNow)!.test;
  const maxMin = TIME_OPTIONS.find((t) => t.id === time)!.max;
  const words = parsed.tokens;
  const dropWords = () => setQ(parsed.tokens.join(" "));

  const shown = useMemo(
    () =>
      pool
        .filter(
          (r) =>
            cuisineTest(r) &&
            typeTest(r) &&
            (typeNow !== "meat" || meat === "all" || mainProtein(r) === meat) &&
            (typeNow !== "pie" || pieKind === "all" || (pieKind === "sweet") === !!r.sweet) &&
            totalMinutes(r) <= maxMin &&
            (!softOnly || isSoft(r)) &&
            matchScore(r, words) > 0,
        )
        .sort(
          (a, b) =>
            matchScore(b, words) - matchScore(a, words) || totalMinutes(a) - totalMinutes(b) || a.name.localeCompare(b.name),
        ),
    [pool, cuisineTest, typeTest, typeNow, meat, pieKind, maxMin, softOnly, words],
  );

  const reset = () => setLimit(PAGE);

  return (
    <div className="space-y-5">
      <header className="rounded-3xl bg-gradient-to-r from-orange-200 via-amber-100 to-lime-200 p-5">
        <p className="text-xl font-semibold text-orange-900">{greeting()} 😊</p>
        <h1 className="mt-1 text-3xl font-bold text-stone-900">What shall we cook today? 今天煮什么？</h1>
        <p className="mt-1 text-lg text-stone-800">Pick a cuisine and a type of dish. Every recipe is gentle on salt, sugar and oil.</p>
        <Link href="/mine/edit" className="mt-3 inline-block rounded-xl bg-yellow-500 px-5 py-3 text-lg font-bold text-stone-900 shadow">➕ Add my own recipe 添加我的食谱</Link>
      </header>

      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); reset(); }}
        placeholder="Search: Chinese, pork, tofu soup, 豆腐"
        aria-label="Search recipes"
        className="w-full rounded-xl border-2 border-stone-300 px-4 py-3 text-lg"
      />

      {q.trim() !== "" && (
        <p className="flex flex-wrap items-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-lg text-sky-900" role="status">
          <span>
            Showing{parsed.understood.length > 0 ? <b> {parsed.understood.join(" · ")}</b> : null}
            {words.length > 0 ? <> with <b>{words.join(" + ")}</b></> : null}
          </span>
          <button type="button" onClick={() => { setQ(""); reset(); }} className="rounded-full bg-sky-200 px-3 py-1 text-base font-semibold">✕ Clear search</button>
        </p>
      )}

      <section aria-label="Cuisine">
        <h2 className="mb-2 text-xl font-bold text-orange-700">1. Choose a cuisine 菜系</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CUISINES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCuisine(c.id); if (parsed.cuisineId) dropWords(); reset(); }}
              aria-pressed={cuisineNow === c.id}
              className={`rounded-2xl border-2 px-3 py-3 text-left ${cuisineNow === c.id ? CUISINE_TONE[c.id].on : CUISINE_TONE[c.id].tile}`}
            >
              <span className="block text-2xl">{c.emoji}</span>
              <span className="block text-lg font-semibold leading-tight">{c.label}</span>
              <span className="block text-base opacity-80">{c.zh}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Type of dish">
        <h2 className="mb-2 text-xl font-bold text-emerald-700">2. Choose a type of dish 菜式</h2>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => { setType(t.id); setMeat("all"); setPieKind("all"); if (parsed.typeId) dropWords(); reset(); }} aria-pressed={typeNow === t.id} className={typeChip(t.id, typeNow === t.id)}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        {typeNow === "meat" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {["all", ...MEAT_CHIPS].map((m) => (
              <button key={m} onClick={() => { setMeat(m); reset(); }} className={chip(meat === m)}>{m === "all" ? "Any meat" : m[0].toUpperCase() + m.slice(1)}</button>
            ))}
          </div>
        )}
        {typeNow === "pie" && (
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
            <Link href={`/cook/${r.recipe_id}?for=4`} className={`flex items-start gap-3 rounded-2xl border border-l-8 border-stone-200 bg-white p-4 shadow-sm ${CUISINE_TONE[cuisineIdOf(r)].edge}`}>
              <Thumb id={r.recipe_id} emoji={emojiOf(r)} />
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold leading-snug">{r.name}</span>
                {r.name_zh && <span className="block text-lg text-stone-700">{r.name_zh}</span>}
                <span className="mt-1 flex flex-wrap gap-2 text-base">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900">⏱ {fmtMinutes(totalMinutes(r))}</span>
                  <span className={`rounded-full px-3 py-1 font-semibold ${CUISINE_TONE[cuisineIdOf(r)].badge}`}>{originOf(r)}</span>
                  {r.dish_class !== "soup" && r.dish_class !== "vegetable" && r.dish_class !== "pie" && r.dish_class !== "salad" && <span className="rounded-full bg-stone-100 px-3 py-1">{mainProtein(r)}</span>}
                  {r.sweet && <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-900">sweet</span>}
                  {isSoft(r) && <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-900">soft</span>}
                </span>
              </span>
              <span className="flex flex-col gap-2">
                <HeartButton id={r.recipe_id} servings={4} />
                <button
                  type="button"
                  aria-label={`Add ${r.name} to the meal plan`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setToast(""); setPlanFor(r.recipe_id); }}
                  className="rounded-full border-2 border-emerald-500 bg-emerald-50 px-3 py-2 text-base font-semibold text-emerald-900"
                >
                  📅 Plan
                </button>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {shown.length > limit && (
        <button onClick={() => setLimit(limit + PAGE)} className="w-full rounded-xl bg-emerald-700 px-4 py-4 text-xl font-semibold text-white">
          Show more ({shown.length - limit} left)
        </button>
      )}

      {toast && (
        <p className="fixed inset-x-4 bottom-24 z-20 rounded-2xl bg-emerald-700 px-4 py-4 text-center text-lg font-semibold text-white shadow-lg md:bottom-6 md:left-auto md:max-w-md" role="status">
          ✓ {toast}
        </p>
      )}
      {planFor && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/50 md:items-center" role="dialog" aria-modal="true" aria-label="Add to meal plan">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-4 md:rounded-2xl">
            <p className="mb-2 text-xl font-bold">{pool.find((r) => r.recipe_id === planFor)?.name}</p>
            <AddToPlan recipeId={planFor} servings={4} startOpen onDone={(m) => { setPlanFor(null); if (m) { setToast(m); setTimeout(() => setToast(""), 4000); } }} />
          </div>
        </div>
      )}
      <p className="text-sm text-stone-500">Sample recipes written for this app. Not yet taste-tested. Chinese names are not yet checked by a native speaker.</p>
    </div>
  );
}
