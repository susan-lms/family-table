import Link from "next/link";

const links = [
  { href: "/", label: "Today" },
  { href: "/planner", label: "Week" },
  { href: "/shopping", label: "Shopping" },
];

export default function Nav() {
  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 inset-x-0 z-10 flex border-t border-stone-300 bg-white md:static md:border-t-0 md:border-b md:justify-start md:gap-2 md:px-6"
    >
      <span className="hidden md:flex items-center pr-6 text-xl font-bold text-emerald-800">Family Table</span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="flex-1 md:flex-none px-4 py-4 text-center text-lg font-semibold text-stone-800 hover:bg-emerald-50 md:px-6"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
