"use client";

import { useEffect, useState } from "react";

const KEY = "family-table-text-level";
const OLD_KEY = "family-table-big-text"; // the old on/off button
/** Page text sizes in pixels. Everything on the page scales with this. Level 1 is the new, smaller normal size. */
export const TEXT_SIZES = [13, 15, 17, 19, 21, 24];
export const DEFAULT_LEVEL = 1;

const clamp = (n: number) => Math.min(TEXT_SIZES.length - 1, Math.max(0, n));

export default function TextSize() {
  const [level, setLevel] = useState(DEFAULT_LEVEL);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved !== null && !Number.isNaN(Number(saved))) setLevel(clamp(Number(saved)));
      else if (localStorage.getItem(OLD_KEY) === "1") setLevel(4); // people who chose "Bigger text" stay on big text
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--ft-size", `${TEXT_SIZES[level]}px`);
    try {
      localStorage.setItem(KEY, String(level));
    } catch {}
  }, [level]);

  const btn =
    "min-h-[40px] min-w-[48px] rounded-full bg-stone-200 px-3 text-[16px] font-bold text-stone-900 disabled:opacity-40";

  return (
    <div className="no-print mx-auto flex max-w-4xl items-center justify-end gap-2 px-4 pt-2">
      <span className="text-[14px] font-semibold text-stone-700" aria-hidden>Text size 字</span>
      <button type="button" onClick={() => setLevel(clamp(level - 1))} disabled={level === 0} aria-label="Smaller text" className={btn}>
        A−
      </button>
      <span className="min-w-[2.5rem] text-center text-[14px] font-semibold text-stone-700" role="status" aria-label={`Text size ${level + 1} of ${TEXT_SIZES.length}`}>
        {level + 1}/{TEXT_SIZES.length}
      </span>
      <button type="button" onClick={() => setLevel(clamp(level + 1))} disabled={level === TEXT_SIZES.length - 1} aria-label="Bigger text" className={btn}>
        A+
      </button>
    </div>
  );
}
