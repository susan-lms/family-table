"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { findRecipe, library } from "@/lib/sample-data";
import { baselinePlan, PLAN_DAYS, PLAN_START } from "@/lib/plan-data";
import { generatePlan } from "@/lib/generator";
import { checkDay, repeatConflict } from "@/lib/rules";
import { MEAT_FREE_WEEKDAYS, QUICK_WEEKDAYS } from "@/lib/servings";
import { suggestDinner } from "@/lib/dinner-mode";
import type { PlannedDay, Recipe, Slot } from "@/lib/types";

const KEY = "family-table-plan-v4";
const SETTINGS_KEY = "family-table-settings-v1";
const SLOTS: Slot[] = ["lunch", "dinner"];

export type SwapResult = { ok: true } | { ok: false; message: string };

export interface PlanSettings { quickWeekdays: number[]; meatFreeWeekdays: number[] }
export const DEFAULT_SETTINGS: PlanSettings = { quickWeekdays: QUICK_WEEKDAYS, meatFreeWeekdays: MEAT_FREE_WEEKDAYS };

interface PlanContextValue {
  days: PlannedDay[];
  swap: (date: string, slot: Slot, index: number, recipe: Recipe) => SwapResult;
  /** Replace a whole dinner (festival menu). Must follow every meal rule. */
  setDinner: (date: string, dishes: Recipe[]) => SwapResult;
  /** Turn a dinner into a quick one-pot night, or back into a full dinner. */
  changeDinnerMode: (date: string, mode: "quick" | "full") => SwapResult;
  settings: PlanSettings;
  /** Change the weekly pattern and rebuild the whole plan (your dish changes are cleared). */
  applySettings: (s: PlanSettings) => SwapResult;
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

/** Rebuild days from saved recipe IDs. Anything unknown falls back to the base plan. */
function fromSaved(saved: Saved, base: PlannedDay[]): PlannedDay[] {
  return base.map((day) => {
    const s = saved[day.date];
    if (!s) return day;
    const slots = { ...day.slots };
    for (const slot of SLOTS) {
      const ids = s[slot];
      if (!Array.isArray(ids)) continue;
      const recipes = ids.map((id) => findRecipe(id));
      if (recipes.length > 0 && recipes.every(Boolean)) slots[slot] = recipes as Recipe[];
    }
    return { ...day, slots };
  });
}

const sameList = (a: number[], b: number[]) => [...a].sort().join() === [...b].sort().join();
const isDefault = (s: PlanSettings) => sameList(s.quickWeekdays, DEFAULT_SETTINGS.quickWeekdays) && sameList(s.meatFreeWeekdays, DEFAULT_SETTINGS.meatFreeWeekdays);
const buildBase = (s: PlanSettings): PlannedDay[] =>
  isDefault(s) ? baselinePlan : generatePlan({ startDate: PLAN_START, days: PLAN_DAYS, library, quickWeekdays: s.quickWeekdays, meatFreeWeekdays: s.meatFreeWeekdays }).days;

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PlanSettings>(DEFAULT_SETTINGS);
  const [base, setBase] = useState<PlannedDay[]>(baselinePlan);
  const [days, setDays] = useState<PlannedDay[]>(baselinePlan);

  useEffect(() => {
    try {
      let s = DEFAULT_SETTINGS;
      const rawS = window.localStorage.getItem(SETTINGS_KEY);
      if (rawS) {
        const p = JSON.parse(rawS) as PlanSettings;
        if (Array.isArray(p.quickWeekdays) && Array.isArray(p.meatFreeWeekdays)) s = p;
      }
      const b = buildBase(s);
      setSettings(s);
      setBase(b);
      const raw = window.localStorage.getItem(KEY);
      setDays(raw ? fromSaved(JSON.parse(raw) as Saved, b) : b);
    } catch {
      /* no saved plan, or storage not available: keep the original plan */
    }
  }, []);

  const save = (next: PlannedDay[]) => {
    try { window.localStorage.setItem(KEY, JSON.stringify(toSaved(next))); } catch { /* ignore */ }
  };

  const commit = (next: PlannedDay[], date: string): SwapResult => {
    // Final safety check: the day must still follow every meal rule.
    const problems = checkDay(next.find((d) => d.date === date) as PlannedDay);
    if (problems.length) return { ok: false, message: problems[0].message };
    setDays(next);
    save(next);
    return { ok: true };
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
      return commit(next, date);
    },
    [days], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setDinner = useCallback(
    (date: string, dishes: Recipe[]): SwapResult => {
      if (!days.some((d) => d.date === date)) return { ok: false, message: "That date is not in the 90-day plan." };
      const without = days.map((d) => (d.date === date ? { ...d, slots: { ...d.slots, dinner: [] } } : d));
      for (const r of dishes) {
        const conflict = repeatConflict(without, date, r);
        if (conflict) return { ok: false, message: `${r.name}: ${conflict}` };
      }
      const next = days.map((d) => (d.date === date ? { ...d, slots: { ...d.slots, dinner: dishes } } : d));
      return commit(next, date);
    },
    [days], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const changeDinnerMode = useCallback(
    (date: string, mode: "quick" | "full"): SwapResult => {
      const choice = suggestDinner(days, date, mode, library, settings.meatFreeWeekdays);
      if (!choice.ok) return choice;
      const next = days.map((d) => (d.date === date ? { ...d, slots: { ...d.slots, dinner: choice.dishes } } : d));
      return commit(next, date);
    },
    [days, settings.meatFreeWeekdays], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const applySettings = useCallback((s: PlanSettings): SwapResult => {
    const b = buildBase(s);
    if (b.length < PLAN_DAYS) return { ok: false, message: "There are not enough dishes for that pattern without breaking the 14-day rule. Try fewer meat-free days." };
    setSettings(s);
    setBase(b);
    setDays(b);
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
      window.localStorage.removeItem(KEY);
    } catch { /* ignore */ }
    return { ok: true };
  }, []);

  const reset = useCallback(() => {
    setDays(base);
    try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
  }, [base]);

  const changed = JSON.stringify(toSaved(days)) !== JSON.stringify(toSaved(base));

  return <PlanContext.Provider value={{ days, swap, setDinner, changeDinnerMode, settings, applySettings, reset, changed }}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside PlanProvider");
  return ctx;
}
