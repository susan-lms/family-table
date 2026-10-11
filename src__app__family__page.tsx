"use client";

import { usePeople } from "@/components/PeopleProvider";

export default function Family() {
  const { people, update } = usePeople();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Family notes 家人备注</h1>
      <p className="text-lg">
        Write a name and the foods each person should avoid, separated by commas (for example: <em>prawn, beef, peanut</em>). The Today and Week pages will show a warning on any dish that has it.
      </p>
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-base text-amber-900">
        Notes stay on this device only. This is a reminder, not medical advice: for allergies, always check labels and ask the doctor. Dishes only list the ingredients we know about.
      </p>
      <ul className="space-y-3">
        {people.map((p) => (
          <li key={p.id} className="rounded-2xl border border-stone-300 bg-white p-4">
            <label className="block text-base font-semibold">Name
              <input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-lg" />
            </label>
            <label className="mt-2 block text-base font-semibold">Avoids (comma separated)
              <input value={p.avoid} onChange={(e) => update(p.id, { avoid: e.target.value })} placeholder="e.g. prawn, beef" className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-lg" />
            </label>
            <label className="mt-2 block text-base font-semibold">Note (optional)
              <input value={p.note} onChange={(e) => update(p.id, { note: e.target.value })} placeholder="e.g. likes soft food" className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-lg" />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
