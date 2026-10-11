import type { PlannedDay, Recipe } from "./types";
import { mainProtein } from "./protein";

export interface Person { id: string; name: string; avoid: string; note: string }

/** Starting list for the household of 8. Names and notes are edited on the Family page and stay on this device only. */
export const DEFAULT_PEOPLE: Person[] = [
  "Senior 1", "Senior 2", "Woman 1", "Woman 2", "Woman 3", "Woman 4", "Man 1", "Man 2",
].map((name, k) => ({ id: `p${k + 1}`, name, avoid: "", note: "" }));

const split = (s: string): string[] => s.split(/[,;，、\n]/).map((x) => x.trim().toLowerCase()).filter(Boolean);

/** Does this dish contain something the person avoids? Matches ingredient names, allergens, the main meat or fish type and the dish name. */
export function dishMatches(r: Recipe, avoid: string): string[] {
  const hits: string[] = [];
  const names = (r.ingredients ?? []).map((g) => g.name.toLowerCase());
  const allergens = (r.allergens ?? []).map((a) => a.toLowerCase());
  const type = mainProtein(r);
  for (const word of split(avoid)) {
    const stem = word.replace(/s$/, "");
    const found =
      names.some((n) => n.includes(stem)) ||
      allergens.some((a) => a.includes(stem)) ||
      r.name.toLowerCase().includes(stem) ||
      (word === type) ||
      (word === "shellfish" && type === "seafood") ||
      (word === "seafood" && (type === "seafood" || (r.ingredients ?? []).some((g) => g.category === "Seafood"))) ||
      (word === "meat" && ["chicken", "pork", "beef"].includes(type)) ||
      (word === "dairy" && (r.ingredients ?? []).some((g) => /milk|cheese|yoghurt|butter|cream/i.test(g.name)));
    if (found) hits.push(word);
  }
  return hits;
}

export interface AvoidWarning { person: string; dish: string; word: string }

/** Warnings for one day: who should be careful with which dish. */
export function avoidWarnings(day: PlannedDay, people: Person[]): AvoidWarning[] {
  const out: AvoidWarning[] = [];
  for (const p of people) {
    if (!p.avoid.trim()) continue;
    for (const r of [...day.slots.lunch, ...day.slots.dinner])
      for (const word of dishMatches(r, p.avoid)) out.push({ person: p.name, dish: r.name, word });
  }
  return out;
}
