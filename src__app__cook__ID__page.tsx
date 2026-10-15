import { notFound } from "next/navigation";
import CookMode from "@/components/CookMode";
import { findRecipe } from "@/lib/sample-data";

export default async function CookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ for?: string }>;
}) {
  const { id } = await params;
  const { for: forParam } = await searchParams;
  const recipe = findRecipe(id);
  if (!recipe || !recipe.steps) notFound();
  const n = Number(forParam);
  const servings = [2, 4, 6, 8].includes(n) ? n : 8;
  return <CookMode recipe={recipe} initialServings={servings} />;
}
