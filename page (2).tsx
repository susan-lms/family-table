import DayCard from "@/components/DayCard";
import { sampleDays } from "@/lib/sample-data";
import { checkNoRepeat } from "@/lib/rules";

export default function Planner() {
  const repeats = checkNoRepeat(sampleDays);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Weekly planner</h1>
      <p className="rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">
        Prototype: only 2 sample days so far. The full 90 days needs many more reviewed recipes.
      </p>
      <p className={`rounded-lg px-3 py-2 text-base font-medium ${repeats.length ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>
        {repeats.length ? repeats.map((p) => p.message).join(" ") : "✓ 14-day no-repeat rule passed for these days"}
      </p>
      {sampleDays.map((d) => <DayCard key={d.date} day={d} />)}
    </div>
  );
}
