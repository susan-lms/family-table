import assert from "node:assert/strict";
import { checkDay, checkNoRepeat, validatePlan } from "./rules";
import type { DishClass, PlannedDay, Recipe } from "./types";

let n = 0;
const r = (cls: DishClass, id?: string): Recipe => ({
  recipe_id: id ?? `S${++n}`,
  name: `Sample ${id ?? n}`,
  cuisine: "Chinese",
  dish_class: cls,
  servings_default: 8,
  prep_time_minutes: 10,
  cook_time_minutes: 20,
  estimated_cost_sgd: 4,
  is_sample: true,
});

const goodDay = (date: string, tag = ""): PlannedDay => ({
  date,
  slots: {
    breakfast: [r("breakfast_item", tag + "b1"), r("breakfast_item", tag + "b2")],
    morning_tea: [r("snack", tag + "m1")],
    lunch: [r("protein", tag + "l1"), r("vegetable", tag + "l2")],
    afternoon_tea: [r("snack", tag + "a1")],
    dinner: [
      r("protein", tag + "d1"), r("protein", tag + "d2"),
      r("vegetable", tag + "d3"), r("vegetable", tag + "d4"),
      r("soup", tag + "d5"),
    ],
  },
});

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log("ok -", name); };

test("a correct day has no problems", () => assert.equal(checkDay(goodDay("2026-10-12")).length, 0));

test("breakfast with 3 items fails", () => {
  const d = goodDay("2026-10-12");
  d.slots.breakfast.push(r("breakfast_item"));
  assert.ok(checkDay(d).some((p) => p.rule === "breakfast"));
});

test("lunch with 2 proteins fails", () => {
  const d = goodDay("2026-10-12");
  d.slots.lunch = [r("protein"), r("protein")];
  assert.ok(checkDay(d).some((p) => p.rule === "lunch"));
});

test("dinner without soup fails", () => {
  const d = goodDay("2026-10-12");
  d.slots.dinner[4] = r("vegetable");
  assert.ok(checkDay(d).some((p) => p.rule === "dinner"));
});

test("tea break with non-snack fails", () => {
  const d = goodDay("2026-10-12");
  d.slots.morning_tea = [r("protein")];
  assert.ok(checkDay(d).some((p) => p.rule === "tea-break"));
});

test("same recipe 13 days later is blocked", () => {
  const a = goodDay("2026-10-12", "x");
  const b = goodDay("2026-10-25", "y");
  b.slots.lunch[0] = a.slots.lunch[0];
  assert.equal(checkNoRepeat([a, b]).length, 1);
});

test("same recipe 14 days later is allowed", () => {
  const a = goodDay("2026-10-12", "x");
  const b = goodDay("2026-10-26", "y");
  b.slots.lunch[0] = a.slots.lunch[0];
  assert.equal(checkNoRepeat([a, b]).length, 0);
});

test("same recipe twice in one day is blocked", () => {
  const a = goodDay("2026-10-12", "x");
  a.slots.afternoon_tea = [a.slots.morning_tea[0]];
  assert.ok(checkNoRepeat([a]).length > 0);
});

test("validatePlan combines all rules", () => {
  assert.equal(validatePlan([goodDay("2026-10-12", "x"), goodDay("2026-10-13", "y")]).length, 0);
});

console.log(`\n${passed} tests passed`);
