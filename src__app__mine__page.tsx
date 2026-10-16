"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useMyRecipes } from "@/components/MyRecipesProvider";
import { Thumb } from "@/components/PhotosProvider";
import { emojiOf, fmtMinutes, totalMinutes, originOf } from "@/lib/browse";

export default function MyRecipes() {
  const { recipes, ready, remove, restore } = useMyRecipes();
  const [msg, setMsg] = useState("");
  const file = useRef<HTMLInputElement>(null);

  const backup = () => {
    const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `my-recipes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const n = restore(Array.isArray(data) ? data : []);
      setMsg(n > 0 ? `Restored ${n} recipe${n === 1 ? "" : "s"}.` : "That file has no recipes from this app.");
    } catch {
      setMsg("Sorry, that file could not be read.");
    }
    if (file.current) file.current.value = "";
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-yellow-700">⭐ My recipes 我的食谱</h1>
      <p className="text-lg">Recipes you add yourself. They are kept only on this phone or computer, so other phones will not see them.</p>
      <Link href="/mine/edit" className="inline-block rounded-xl bg-yellow-500 px-6 py-4 text-xl font-bold text-stone-900 shadow">➕ Add a recipe</Link>

      {!ready && <p className="text-lg">Loading…</p>}
      {ready && recipes.length === 0 && (
        <p className="rounded-xl bg-yellow-50 px-4 py-4 text-lg text-yellow-900">You have not added any recipe yet. Tap “Add a recipe”. You can type one in, or paste the whole recipe from a website.</p>
      )}

      <ul className="space-y-3">
        {recipes.map((r) => (
          <li key={r.recipe_id} className="rounded-2xl border border-l-8 border-stone-200 border-l-yellow-500 bg-white p-4 shadow-sm">
            <Link href={`/cook/${r.recipe_id}?for=4`} className="flex items-start gap-3">
              <Thumb id={r.recipe_id} emoji={emojiOf(r)} />
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold leading-snug">{r.name}</span>
                {r.name_zh && <span className="block text-lg text-stone-700">{r.name_zh}</span>}
                <span className="mt-1 flex flex-wrap gap-2 text-base">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900">⏱ {fmtMinutes(totalMinutes(r))}</span>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 font-semibold text-yellow-900">{originOf(r)}</span>
                </span>
              </span>
            </Link>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`/mine/edit?id=${r.recipe_id}`} className="rounded-xl bg-stone-200 px-4 py-2 text-lg font-semibold">✏️ Edit</Link>
              <button
                onClick={() => { if (window.confirm(`Delete “${r.name}”? This cannot be undone.`)) remove(r.recipe_id); }}
                className="rounded-xl bg-red-100 px-4 py-2 text-lg font-semibold text-red-900"
              >
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <section className="rounded-2xl bg-stone-100 p-4">
        <h2 className="text-xl font-bold">Keep a backup</h2>
        <p className="mt-1 text-base text-stone-700">If you clear this browser’s data or change phone, your recipes are lost. Save a backup file now and then, and restore it here when you need to.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={backup} disabled={recipes.length === 0} className="rounded-xl bg-emerald-700 px-4 py-3 text-lg font-semibold text-white disabled:opacity-40">⬇ Save backup</button>
          <button onClick={() => file.current?.click()} className="rounded-xl bg-sky-700 px-4 py-3 text-lg font-semibold text-white">⬆ Restore backup</button>
          <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        {msg && <p className="mt-2 text-lg font-semibold text-emerald-800" role="status">{msg}</p>}
      </section>
    </div>
  );
}
