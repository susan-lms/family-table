"use client";

import { useEffect, useState } from "react";

const KEY = "family-table-big-text";

export default function TextSize() {
  const [big, setBig] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setBig(true);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("big", big);
    try {
      localStorage.setItem(KEY, big ? "1" : "0");
    } catch {}
  }, [big]);

  return (
    <div className="no-print mx-auto flex max-w-4xl justify-end px-4 pt-3">
      <button
        onClick={() => setBig(!big)}
        aria-pressed={big}
        className="rounded-full bg-stone-200 px-4 py-2 text-base font-semibold"
      >
        {big ? "Normal text" : "Bigger text 大字"}
      </button>
    </div>
  );
}
