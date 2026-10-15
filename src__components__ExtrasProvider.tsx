"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Slot } from "@/lib/types";

const KEY = "family-table-extras-v1";

/** A recipe the family added to a date by hand (on top of the made-for-you meal plan). Kept on this phone/browser only. */
export interface Extra { uid: string; date: string; slot: Slot; recipeId: string; servings: number }

interface Ctx {
  extras: Extra[];
  add: (e: Omit<Extra, "uid">) => void;
  remove: (uid: string) => void;
}
const ExtrasContext = createContext<Ctx | null>(null);

export function ExtrasProvider({ children }: { children: React.ReactNode }) {
  const [extras, setExtras] = useState<Extra[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setExtras(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  const write = useCallback((next: Extra[]) => {
    setExtras(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);
  const add = useCallback((e: Omit<Extra, "uid">) => {
    write([...extras, { ...e, uid: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }]);
  }, [extras, write]);
  const remove = useCallback((uid: string) => write(extras.filter((x) => x.uid !== uid)), [extras, write]);
  return <ExtrasContext.Provider value={{ extras, add, remove }}>{children}</ExtrasContext.Provider>;
}

export function useExtras(): Ctx {
  const c = useContext(ExtrasContext);
  if (!c) throw new Error("useExtras must be used inside ExtrasProvider");
  return c;
}
