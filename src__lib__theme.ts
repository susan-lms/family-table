/** Colours. Every cuisine and dish type has its own colour, but colour is never the only clue: names and emoji are always shown too. Class names are written out in full so Tailwind can find them. */
export interface Tone { tile: string; on: string; edge: string; badge: string; dot: string }

export const CUISINE_TONE: Record<string, Tone> = {
  all: { tile: "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200", on: "bg-slate-600 border-slate-700 text-white", edge: "border-l-slate-500", badge: "bg-slate-100 text-slate-900", dot: "bg-slate-500" },
  chinese: { tile: "bg-red-100 border-red-300 text-red-900 hover:bg-red-200", on: "bg-red-600 border-red-700 text-white", edge: "border-l-red-500", badge: "bg-red-100 text-red-900", dot: "bg-red-500" },
  cantonese: { tile: "bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200", on: "bg-orange-600 border-orange-700 text-white", edge: "border-l-orange-500", badge: "bg-orange-100 text-orange-900", dot: "bg-orange-500" },
  teochew: { tile: "bg-sky-100 border-sky-300 text-sky-900 hover:bg-sky-200", on: "bg-sky-600 border-sky-700 text-white", edge: "border-l-sky-500", badge: "bg-sky-100 text-sky-900", dot: "bg-sky-500" },
  hokkien: { tile: "bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200", on: "bg-teal-600 border-teal-700 text-white", edge: "border-l-teal-500", badge: "bg-teal-100 text-teal-900", dot: "bg-teal-500" },
  hakka: { tile: "bg-violet-100 border-violet-300 text-violet-900 hover:bg-violet-200", on: "bg-violet-600 border-violet-700 text-white", edge: "border-l-violet-500", badge: "bg-violet-100 text-violet-900", dot: "bg-violet-500" },
  western: { tile: "bg-indigo-100 border-indigo-300 text-indigo-900 hover:bg-indigo-200", on: "bg-indigo-600 border-indigo-700 text-white", edge: "border-l-indigo-500", badge: "bg-indigo-100 text-indigo-900", dot: "bg-indigo-500" },
  mexican: { tile: "bg-lime-100 border-lime-300 text-lime-900 hover:bg-lime-200", on: "bg-lime-600 border-lime-700 text-white", edge: "border-l-lime-500", badge: "bg-lime-100 text-lime-900", dot: "bg-lime-500" },
  japanese: { tile: "bg-pink-100 border-pink-300 text-pink-900 hover:bg-pink-200", on: "bg-pink-600 border-pink-700 text-white", edge: "border-l-pink-500", badge: "bg-pink-100 text-pink-900", dot: "bg-pink-500" },
  korean: { tile: "bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200", on: "bg-rose-600 border-rose-700 text-white", edge: "border-l-rose-500", badge: "bg-rose-100 text-rose-900", dot: "bg-rose-500" },
  thai: { tile: "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200", on: "bg-amber-600 border-amber-700 text-white", edge: "border-l-amber-500", badge: "bg-amber-100 text-amber-900", dot: "bg-amber-500" },
  southeast: { tile: "bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200", on: "bg-emerald-600 border-emerald-700 text-white", edge: "border-l-emerald-500", badge: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-500" },
  other: { tile: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-900 hover:bg-fuchsia-200", on: "bg-fuchsia-600 border-fuchsia-700 text-white", edge: "border-l-fuchsia-500", badge: "bg-fuchsia-100 text-fuchsia-900", dot: "bg-fuchsia-500" },
};

export const TYPE_TONE: Record<string, Tone> = {
  all: { tile: "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200", on: "bg-slate-600 border-slate-700 text-white", edge: "border-l-slate-500", badge: "bg-slate-100 text-slate-900", dot: "bg-slate-500" },
  meat: { tile: "bg-red-100 border-red-300 text-red-900 hover:bg-red-200", on: "bg-red-600 border-red-700 text-white", edge: "border-l-red-500", badge: "bg-red-100 text-red-900", dot: "bg-red-500" },
  seafood: { tile: "bg-sky-100 border-sky-300 text-sky-900 hover:bg-sky-200", on: "bg-sky-600 border-sky-700 text-white", edge: "border-l-sky-500", badge: "bg-sky-100 text-sky-900", dot: "bg-sky-500" },
  veg: { tile: "bg-green-100 border-green-300 text-green-900 hover:bg-green-200", on: "bg-green-600 border-green-700 text-white", edge: "border-l-green-500", badge: "bg-green-100 text-green-900", dot: "bg-green-500" },
  eggtofu: { tile: "bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200", on: "bg-yellow-600 border-yellow-700 text-white", edge: "border-l-yellow-500", badge: "bg-yellow-100 text-yellow-900", dot: "bg-yellow-500" },
  soup: { tile: "bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200", on: "bg-orange-600 border-orange-700 text-white", edge: "border-l-orange-500", badge: "bg-orange-100 text-orange-900", dot: "bg-orange-500" },
  wrap: { tile: "bg-lime-100 border-lime-300 text-lime-900 hover:bg-lime-200", on: "bg-lime-600 border-lime-700 text-white", edge: "border-l-lime-500", badge: "bg-lime-100 text-lime-900", dot: "bg-lime-500" },
  pie: { tile: "bg-pink-100 border-pink-300 text-pink-900 hover:bg-pink-200", on: "bg-pink-600 border-pink-700 text-white", edge: "border-l-pink-500", badge: "bg-pink-100 text-pink-900", dot: "bg-pink-500" },
  salad: { tile: "bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200", on: "bg-emerald-600 border-emerald-700 text-white", edge: "border-l-emerald-500", badge: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-500" },
  meal: { tile: "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200", on: "bg-amber-600 border-amber-700 text-white", edge: "border-l-amber-500", badge: "bg-amber-100 text-amber-900", dot: "bg-amber-500" },
};

/** Colour of each main tab (bottom bar on the phone, top bar on a computer). */
export const TAB_TONE: Record<string, { idle: string; active: string }> = {
  "/": { idle: "bg-orange-100 text-orange-900", active: "bg-orange-500 text-white" },
  "/saved": { idle: "bg-rose-100 text-rose-900", active: "bg-rose-500 text-white" },
  "/planner": { idle: "bg-emerald-100 text-emerald-900", active: "bg-emerald-600 text-white" },
  "/more": { idle: "bg-violet-100 text-violet-900", active: "bg-violet-500 text-white" },
};
