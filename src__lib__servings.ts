import type { Slot } from "./types";

/** How many people each meal is cooked for. Recipes are written for 8, so lunch (4 people) uses half. */
export const SLOT_SERVINGS: Record<Slot, number> = { lunch: 4, dinner: 8 };
export const RECIPE_SERVINGS = 8;

export const slotFactor = (slot: Slot): number => SLOT_SERVINGS[slot] / RECIPE_SERVINGS;

/** Quick one-pot dinners fall on these weekdays (0 = Sunday). Default: Monday, Wednesday, Friday. */
export const QUICK_WEEKDAYS = [1, 3, 5];
export const isQuickNight = (isoDate: string, quickWeekdays: number[] = QUICK_WEEKDAYS): boolean =>
  quickWeekdays.includes(new Date(isoDate + "T00:00:00Z").getUTCDay());
