import DayCard from "@/components/DayCard";
import { sampleDays } from "@/lib/sample-data";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Today&apos;s menu</h1>
      <p className="rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">
        Prototype: this is a sample day with placeholder costs. Tap <strong>Change</strong> on any dish to swap it.
      </p>
      <DayCard date={sampleDays[0].date} />
    </div>
  );
}
