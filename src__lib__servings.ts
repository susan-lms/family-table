import type { Slot } from "./types";

/** How many people each meal is cooked for. Recipes are written for 8, so lunch (4 people) uses half. */
export const SLOT_SERVINGS: Record<Slot, number> = { lunch: 4, dinner: 8 };
export const RECIPE_SERVINGS = 8;

export const slotFactor = (slot: Slot): number => SLOT_SERVINGS[slot] / RECIPE_SERVINGS;

/** Quick one-pot dinners fall on these weekdays (0 = Sunday). Default: Monday, Wednesday, Friday. */
export const QUICK_WEEKDAYS = [1, 3, 5];
export const isQuickNight = (isoDate: string, quickWeekdays: number[] = QUICK_WEEKDAYS): boolean =>
  quickWeekdays.includes(new Date(isoDate + "T00:00:00Z").getUTCDay());

/** Meat-free days (no meat, fish or seafood all day). Default: Thursday. */
export const MEAT_FREE_WEEKDAYS = [4];
export const isMeatFreeDay = (isoDate: string, days: number[] = MEAT_FREE_WEEKDAYS): boolean =>
  days.includes(new Date(isoDate + "T00:00:00Z").getUTCDay());

/** Lunch is a one-dish meal (porridge, noodles or sandwich) on these weekdays. Default: Tue, Thu, Sat. */
export const LUNCH_ONEDISH_WEEKDAYS = [2, 4, 6];
/** Dinner is a non-rice night (noodles or sandwiches, plus soup) on these weekdays. Default: Sunday. */
export const NOODLE_DINNER_WEEKDAYS = [0];
export const weekdayOf = (isoDate: string): number => new Date(isoDate + "T00:00:00Z").getUTCDay();
