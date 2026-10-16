import Link from "next/link";

const items = [
  { href: "/mine", title: "My recipes 我的食谱", text: "Add a recipe you found on a website or in a book. It is kept on this phone only." },
  { href: "/today", title: "Today's menu 今日菜单", text: "What is on the 90-day meal plan for today." },
  { href: "/shopping", title: "Meal plan shopping list 购物清单", text: "One shopping list for the next days of the meal plan." },
  { href: "/recipes", title: "Meal plan recipe check 食谱库", text: "See how many dishes the meal planner has, and filter them." },
  { href: "/festivals", title: "Festival menus 节日菜单", text: "Dongzhi, Christmas, New Year's Eve and Chinese New Year dinners. Put one on its date with one tap." },
  { href: "/family", title: "Family notes 家人备注", text: "Write who avoids what (for example prawns or beef). The Today and Week pages will warn you." },
  { href: "/settings", title: "Weekly pattern 每周安排", text: "Choose quick one-pot nights, porridge/noodle lunches, noodle dinners and the meat-free day." },
];

const EDGES = ["border-l-orange-500", "border-l-emerald-500", "border-l-sky-500", "border-l-rose-500", "border-l-violet-500", "border-l-amber-500"];

export default function More() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-violet-600">✨ More</h1>
      <ul className="space-y-3">
        {items.map((it, n) => (
          <li key={it.href}>
            <Link href={it.href} className={`block rounded-2xl border border-l-8 border-stone-200 bg-white p-5 shadow-sm ${EDGES[n % EDGES.length]}`}>
              <span className="block text-2xl font-bold text-stone-900">{it.title}</span>
              <span className="mt-1 block text-lg">{it.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
