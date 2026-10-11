"use client";

import Link from "next/link";
import DayCard from "@/components/DayCard";
import { PLAN_START, baselinePlan, todaySG } from "@/lib/plan-data";

export default function Home() {
  const today = todaySG();
  const last = baselinePlan[baselinePlan.length - 1].date;
  const inPlan = today >= PLAN_START && today <= last;
  const date = inPlan ? today : today < PLAN_START ? PLAN_START : last;
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{inPlan ? "Today's menu" : "Menu"}</h1>
      {!inPlan && (
        <p className="rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">
          {today < PLAN_START ? "Your 90-day plan starts on 12 October 2026. Here is day 1." : "The 90-day plan has ended. Here is the last day."}
        </p>
      )}
      <p className="rounded-lg bg-amber-100 px-3 py-2 text-base text-amber-900">
        Prices are rough estimates, not live supermarket prices. Tap <strong>Change</strong> on any dish to swap it.
      </p>
      <DayCard date={date} />
      <Link href="/planner" className="inline-block text-lg font-semibold text-emerald-800 underline">See the whole week →</Link>
    </div>
  );
}
