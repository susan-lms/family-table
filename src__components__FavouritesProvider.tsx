"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "family-table-saved-v1";

/** Saved recipes: recipe id -> number of people to cook for. Kept on this phone/browser only. */
interface Ctx {
  saved: Record<string, number>;
  isSaved: (id: string) => boolean;
  toggle: (id: string, servings?: number) => void;
  setServings: (id: string, n: number) => void;
  clear: () => void;
}
const FavContext = createContext<Ctx | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<Record<string, number>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  const write = useCallback((next: Record<string, number>) => {
    setSaved(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);
  const value: Ctx = {
    saved,
    isSaved: (id) => id in saved,
    toggle: (id, servings = 4) => {
      const next = { ...saved };
      if (id in next) delete next[id]; else next[id] = servings;
      write(next);
    },
    setServings: (id, n) => write({ ...saved, [id]: n }),
    clear: () => write({}),
  };
  return <FavContext.Provider value={value}>{children}</FavContext.Provider>;
}

export function useFavourites(): Ctx {
  const c = useContext(FavContext);
  if (!c) throw new Error("useFavourites must be used inside FavouritesProvider");
  return c;
}

export function HeartButton({ id, servings, big }: { id: string; servings?: number; big?: boolean }) {
  const { isSaved, toggle } = useFavourites();
  const on = isSaved(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from saved recipes" : "Save this recipe"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id, servings); }}
      className={`rounded-full border-2 font-semibold ${big ? "px-5 py-3 text-lg" : "px-3 py-2 text-base"} ${on ? "border-rose-600 bg-rose-50 text-rose-800" : "border-stone-300 bg-white text-stone-700"}`}
    >
      {on ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
