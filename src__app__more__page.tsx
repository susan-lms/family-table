import Link from "next/link";

const items = [
  { href: "/festivals", title: "Festival menus 节日菜单", text: "Dongzhi, Christmas, New Year's Eve and Chinese New Year dinners. Put one on its date with one tap." },
  { href: "/family", title: "Family notes 家人备注", text: "Write who avoids what (for example prawns or beef). The Today and Week pages will warn you." },
  { href: "/settings", title: "Weekly pattern 每周安排", text: "Choose which nights are quick one-pot nights and which day is meat-free." },
];

export default function More() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">More</h1>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="block rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
              <span className="block text-2xl font-bold text-emerald-800">{it.title}</span>
              <span className="mt-1 block text-lg">{it.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
