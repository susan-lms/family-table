"use client";

import Link from "next/link";
import CookMode from "@/components/CookMode";
import { useMyRecipes } from "@/components/MyRecipesProvider";

/** Shows a recipe the family added themselves. These live on the device, so they are looked up after the page loads. */
export default function MyCook({ id, servings }: { id: string; servings: number }) {
  const { recipes, ready } = useMyRecipes();
  const recipe = recipes.find((r) => r.recipe_id === id);
  if (!ready) return <p className="text-lg">Loading your recipe…</p>;
  if (!recipe) {
    return (
      <div className="space-y-3">
        <p className="rounded-xl bg-amber-100 px-4 py-3 text-lg text-amber-900">This recipe is not on this device. Recipes you add yourself are kept only on the phone or computer where you added them.</p>
        <Link href="/mine" className="inline-block rounded-xl bg-emerald-700 px-5 py-3 text-lg font-semibold text-white">Go to my recipes</Link>
      </div>
    );
  }
  return <CookMode recipe={recipe} initialServings={servings} />;
}
