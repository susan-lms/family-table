"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TAB_TONE } from "@/lib/theme";

const links = [
  { href: "/", label: "Recipes", icon: "🍳" },
  { href: "/saved", label: "Saved", icon: "♥" },
  { href: "/planner", label: "Meal plan", icon: "📅" },
  { href: "/more", label: "More", icon: "✨" },
];

/** A tab is active on its own page, and "Recipes" is also active on a cooking page. */
const isActive = (path: string, href: string) =>
  href === "/" ? path === "/" || path.startsWith("/cook") : path === href || path.startsWith(href + "/");

export default function Nav() {
  const path = usePathname() ?? "/";
  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 inset-x-0 z-10 flex gap-1 border-t-4 border-orange-300 bg-amber-50 p-1 md:static md:justify-start md:gap-2 md:border-t-0 md:border-b-4 md:px-6 md:py-2"
    >
      <span className="hidden md:flex items-center pr-6 text-xl font-bold text-orange-700">🥢 Family Table</span>
      {links.map((l) => {
        const on = isActive(path, l.href);
        const tone = TAB_TONE[l.href];
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 text-center text-base font-bold md:flex-none md:flex-row md:gap-2 md:px-6 md:py-3 md:text-lg ${on ? tone.active : tone.idle}`}
          >
            <span className="text-xl leading-none" aria-hidden>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
