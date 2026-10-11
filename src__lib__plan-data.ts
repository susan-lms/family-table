import { generatePlan } from "./generator";
import { library } from "./sample-data";

/** First day of the 90-day plan (a Monday). */
export const PLAN_START = "2026-10-12";
export const PLAN_DAYS = 90;

/** The starting 90-day plan, built by the rules engine. Same result every time. */
export const baselinePlan = generatePlan({ startDate: PLAN_START, days: PLAN_DAYS, library }).days;

/** Today's date in Singapore as YYYY-MM-DD. */
export const todaySG = (): string =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" });
