import { notFound } from "next/navigation";
import CookMode from "@/components/CookMode";
import MyCook from "@/components/MyCook";
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
  const n = Number(forParam);
  const servings = [2, 4, 6, 8].includes(n) ? n : 8;
  const recipe = findRecipe(id);
  if (!recipe && id.startsWith("R-MY-")) return <MyCook id={id} servings={servings} />; // added by the family: lives on their device
  if (!recipe || !recipe.steps) notFound();
  return <CookMode recipe={recipe} initialServings={servings} />;
}
