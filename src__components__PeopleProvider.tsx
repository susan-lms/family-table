"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_PEOPLE, type Person } from "@/lib/people";

const KEY = "family-table-people-v1";

interface PeopleContextValue {
  people: Person[];
  update: (id: string, patch: Partial<Omit<Person, "id">>) => void;
}
const PeopleContext = createContext<PeopleContextValue | null>(null);

export function PeopleProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>(DEFAULT_PEOPLE);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Person[];
        if (Array.isArray(p) && p.every((x) => x && typeof x.id === "string")) setPeople(p);
      }
    } catch { /* keep defaults */ }
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<Person, "id">>) => {
    setPeople((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return <PeopleContext.Provider value={{ people, update }}>{children}</PeopleContext.Provider>;
}

export function usePeople(): PeopleContextValue {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error("usePeople must be used inside PeopleProvider");
  return ctx;
}
