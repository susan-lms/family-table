"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMyRecipes } from "@/components/MyRecipesProvider";
import {
  CUISINE_CHOICES, SERVES_OPTIONS, TYPE_CHOICES, buildRecipe, draftFromRecipe, parseIngredients, parsePasted, parseSteps, validateDraft, type Draft,
} from "@/lib/my-recipes";

const EMPTY: Draft = { name: "", name_zh: "", cuisineId: "chinese", typeId: "protein", sweet: false, prep: 15, cook: 20, serves: 4, ingredients: "", steps: "", note: "", source: "" };
const field = "w-full rounded-xl border-2 border-stone-300 px-4 py-3 text-lg";
const label = "mb-1 block text-lg font-semibold";

export default function EditRecipe() {
  const router = useRouter();
  const { recipes, ready, save, newId } = useMyRecipes();
  const [editId, setEditId] = useState<string | null>(null);
  const [d, setD] = useState<Draft>(EMPTY);
  const [paste, setPaste] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [filled, setFilled] = useState("");

  // Open an existing recipe for editing: /mine/edit?id=R-MY-...
  useEffect(() => {
    if (!ready) return;
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;
    const r = recipes.find((x) => x.recipe_id === id);
    if (r) { setEditId(id); setD(draftFromRecipe(r)); }
  }, [ready]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const ing = useMemo(() => parseIngredients(d.ingredients), [d.ingredients]);
  const steps = useMemo(() => parseSteps(d.steps), [d.steps]);

  const fillFromPaste = () => {
    const p = parsePasted(paste);
    setD((prev) => ({
      ...prev,
      name: p.name || prev.name,
      ingredients: p.ingredients || prev.ingredients,
      steps: p.steps || prev.steps,
      prep: p.prep ?? prev.prep,
      cook: p.cook ?? prev.cook,
      serves: p.serves && SERVES_OPTIONS.includes(p.serves) ? p.serves : prev.serves,
    }));
    setFilled(p.ingredients || p.steps ? "Filled in below. Please check each part, then choose the cuisine and type." : "I could not find the ingredients and steps. Please type them in below.");
  };

  const onSave = () => {
    const issues = validateDraft(d);
    setProblems(issues);
    if (issues.length > 0) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const id = editId ?? newId();
    save(buildRecipe(d, id));
    router.push(`/cook/${id}?for=4`);
  };

  return (
    <div className="space-y-5">
      <Link href="/mine" className="text-lg font-semibold text-emerald-800 underline">← My recipes</Link>
      <h1 className="text-3xl font-bold text-yellow-700">{editId ? "✏️ Edit recipe" : "➕ Add my own recipe"}</h1>

      {problems.length > 0 && (
        <ul className="list-disc space-y-1 rounded-xl bg-red-50 px-8 py-3 text-lg text-red-900" role="alert">
          {problems.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}

      {!editId && (
        <section className="space-y-2 rounded-2xl bg-yellow-50 p-4">
          <h2 className="text-xl font-bold">Quick way: paste a recipe</h2>
          <p className="text-base text-stone-700">Copy the recipe text from a website and paste it here. Then tap the button and I will sort it into the boxes below.</p>
          <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={5} className={field} placeholder={"Dish name\nIngredients\n200 g chicken\n2 tbsp soy sauce\nMethod\n1. Mix everything…"} aria-label="Paste a recipe" />
          <button type="button" onClick={fillFromPaste} disabled={paste.trim().length < 10} className="rounded-xl bg-yellow-500 px-5 py-3 text-lg font-bold text-stone-900 disabled:opacity-40">Fill in the boxes</button>
          {filled && <p className="text-lg font-semibold text-emerald-800" role="status">{filled}</p>}
        </section>
      )}

      <div>
        <label className={label} htmlFor="n">Name of the dish *</label>
        <input id="n" className={field} value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Granny's steamed fish" />
      </div>
      <div>
        <label className={label} htmlFor="z">Chinese name (if you like)</label>
        <input id="z" className={field} value={d.name_zh ?? ""} onChange={(e) => set("name_zh", e.target.value)} placeholder="例如：外婆蒸鱼" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c">Cuisine</label>
          <select id="c" className={field} value={d.cuisineId} onChange={(e) => set("cuisineId", e.target.value)}>
            {CUISINE_CHOICES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="t">Type of dish</label>
          <select id="t" className={field} value={d.typeId} onChange={(e) => set("typeId", e.target.value)}>
            {TYPE_CHOICES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>
      {d.typeId === "pie" && (
        <label className="flex items-center gap-3 text-lg"><input type="checkbox" className="h-6 w-6" checked={!!d.sweet} onChange={(e) => set("sweet", e.target.checked)} /> This is a sweet pie or tart</label>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="p">Preparing (minutes)</label>
          <input id="p" type="number" min={0} inputMode="numeric" className={field} value={d.prep} onChange={(e) => set("prep", Number(e.target.value))} />
        </div>
        <div>
          <label className={label} htmlFor="k">Cooking (minutes)</label>
          <input id="k" type="number" min={0} inputMode="numeric" className={field} value={d.cook} onChange={(e) => set("cook", Number(e.target.value))} />
        </div>
        <div>
          <label className={label} htmlFor="s">The amounts below are for</label>
          <select id="s" className={field} value={d.serves} onChange={(e) => set("serves", Number(e.target.value))}>
            {SERVES_OPTIONS.map((n) => <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>)}
          </select>
        </div>
      </div>
      <p className="text-base text-stone-600">The app changes the amounts to 2, 4, 6 or 8 people for you when you cook.</p>

      <div>
        <label className={label} htmlFor="i">Ingredients * (one on each line, with the amount first)</label>
        <textarea id="i" rows={7} className={field} value={d.ingredients} onChange={(e) => set("ingredients", e.target.value)} placeholder={"500 g chicken thigh\n2 tbsp light soy sauce\n3 cloves garlic\n1 onion, sliced"} />
        {ing.length > 0 && (
          <div className="mt-2 rounded-xl bg-stone-100 px-4 py-3 text-base">
            <p className="font-semibold">The app understood {ing.length} ingredient{ing.length === 1 ? "" : "s"}:</p>
            <ul className="mt-1 space-y-0.5">
              {ing.map((g, n) => (
                <li key={n} className={g.guessed ? "text-amber-800" : ""}>
                  {g.guessed ? "⚠️ " : "✓ "}{g.qty} {g.unit === "piece" ? "" : g.unit} <strong>{g.name}</strong>{g.prep ? `, ${g.prep}` : ""}
                  {g.guessed && " (no amount found, counted as 1)"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label className={label} htmlFor="m">Steps * (one on each line)</label>
        <textarea id="m" rows={7} className={field} value={d.steps} onChange={(e) => set("steps", e.target.value)} placeholder={"Mix the chicken with the soy sauce.\nSteam for 20 minutes.\nServe hot."} />
        {steps.length > 0 && <p className="mt-1 text-base text-stone-600">{steps.length} step{steps.length === 1 ? "" : "s"}.</p>}
      </div>

      <div>
        <label className={label} htmlFor="o">Notes on less salt, sugar or oil (if you like)</label>
        <input id="o" className={field} value={d.note ?? ""} onChange={(e) => set("note", e.target.value)} placeholder="e.g. I use half the soy sauce" />
      </div>
      <div>
        <label className={label} htmlFor="w">Where did you find it? (if you like)</label>
        <input id="w" className={field} value={d.source ?? ""} onChange={(e) => set("source", e.target.value)} placeholder="e.g. a website name, a book, or a person" />
      </div>

      <p className="rounded-xl bg-sky-50 px-4 py-3 text-base text-sky-900">
        Recipes from websites often have more salt, sugar and oil than your family needs. The app cannot change your recipe. Please adjust the amounts yourself, and check the salt estimate on the recipe page. You can add a photo on the recipe page after you save.
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onSave} className="rounded-xl bg-emerald-700 px-6 py-4 text-xl font-bold text-white">💾 Save recipe</button>
        <Link href="/mine" className="rounded-xl bg-stone-200 px-6 py-4 text-xl font-semibold">Cancel</Link>
      </div>
    </div>
  );
}
