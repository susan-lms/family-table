import { notFound } from "next/navigation";
import CookMode from "@/components/CookMode";
import { findRecipe } from "@/lib/sample-data";

export default async function CookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = findRecipe(id);
  if (!recipe || !recipe.steps) notFound();
  return <CookMode recipe={recipe} />;
}
