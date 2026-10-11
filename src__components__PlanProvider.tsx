"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { findRecipe } from "@/lib/sample-data";
import { baselinePlan } from "@/lib/plan-data";
import { checkDay, repeatConflict } from "@/lib/rules";
import type { PlannedDay, Recipe, Slot } from "@/lib/types";

const KEY = "family-table-plan-v3";
const SLOTS: Slot[] = ["lunch", "dinner"];

export type SwapResult = { ok: true } | { ok: false; message: string };

interface PlanContextValue {
  days: PlannedDay[];
  swap: (date: string, slot: Slot, index: number, recipe: Recipe) => SwapResult;
  reset: () => void;
  changed: boolean;
}

const PlanContext = createContext<PlanContextValue | null>(null);

type Saved = Record<string, Record<string, string[]>>;

function toSaved(days: PlannedDay[]): Saved {
  const out: Saved = {};
  for (const d of days) {
    out[d.date] = {};
    for (const s of SLOTS) out[d.date][s] = d.slots[s].map((r) => r.recipe_id);
  }
  return out;
}

/** Rebuild days from saved recipe IDs. Anything unknown falls back to the original plan. */
function fromSaved(saved: Saved): PlannedDay[] {
  return baselinePlan.map((day) => {
    const s = saved[day.date];
    if (!s) return day;
    const slots = { ...day.slots };
    for (const slot of SLOTS) {
      const ids = s[slot];
      if (!Array.isArray(ids)) continue;
      const recipes = ids.map((id) => findRecipe(id));
      if (recipes.length === day.slots[slot].length && recipes.every(Boolean)) {
        slots[slot] = recipes as Recipe[];
      }
    }
    return { ...day, slots };
  });
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [days, setDays] = useState<PlannedDay[]>(baselinePlan);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setDays(fromSaved(JSON.parse(raw) as Saved));
    } catch {
      /* no saved plan, or storage not available: keep the original plan */
    }
  }, []);

  const save = (next: PlannedDay[]) => {
    try { window.localStorage.setItem(KEY, JSON.stringify(toSaved(next))); } catch { /* ignore */ }
  };

  const swap = useCallback(
    (date: string, slot: Slot, index: number, recipe: Recipe): SwapResult => {
      const day = days.find((d) => d.date === date);
      const old = day?.slots[slot][index];
      if (!day || !old) return { ok: false, message: "Could not find that dish." };
      if (old.dish_class !== recipe.dish_class) return { ok: false, message: "That dish is a different type." };

      // 14-day rule: look 13 days back and ahead, ignoring the dish being replaced.
      const others = days.map((d) =>
        d.date === date
          ? { ...d, slots: { ...d.slots, [slot]: d.slots[slot].filter((_, i) => i !== index) } }
          : d,
      );
      const conflict = repeatConflict(others, date, recipe);
      if (conflict) return { ok: false, message: conflict };

      const next = days.map((d) =>
        d.date === date
          ? { ...d, slots: { ...d.slots, [slot]: d.slots[slot].map((r, i) => (i === index ? recipe : r)) } }
          : d,
      );
      // Final safety check: the day must still follow every meal rule.
      const problems = checkDay(next.find((d) => d.date === date) as PlannedDay);
      if (problems.length) return { ok: false, message: problems[0].message };

      setDays(next);
      save(next);
      return { ok: true };
    },
    [days],
  );

  const reset = useCallback(() => {
    setDays(baselinePlan);
    try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
  }, []);

  const changed = JSON.stringify(toSaved(days)) !== JSON.stringify(toSaved(baselinePlan));

  return <PlanContext.Provider value={{ days, swap, reset, changed }}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside PlanProvider");
  return ctx;
}
