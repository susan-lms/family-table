import assert from "node:assert/strict";
import { checkDay, checkNoRepeat, repeatConflict, validatePlan } from "./rules";
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
    lunch: [r("protein", tag + "l1"), r("vegetable", tag + "l2")],
    dinner: [
      r("protein", tag + "d1"), r("protein", tag + "d2"),
      r("vegetable", tag + "d3"), r("vegetable", tag + "d4"),
      r("soup", tag + "d5"),
    ],
  },
});

const quickDay = (date: string, tag = ""): PlannedDay => ({
  date,
  slots: {
    lunch: [r("protein", tag + "l1"), r("vegetable", tag + "l2")],
    dinner: [r("onepot", tag + "q1"), r("soup", tag + "q2")],
  },
});

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log("ok -", name); };

test("a correct day has no problems", () => assert.equal(checkDay(goodDay("2026-10-12")).length, 0));

test("a quick one-pot night (one-pot meal + soup) is a correct day", () => {
  assert.equal(checkDay(quickDay("2026-10-12")).length, 0);
});

test("lunch with 2 proteins fails", () => {
  const d = goodDay("2026-10-12");
  d.slots.lunch = [r("protein"), r("protein")];
  assert.ok(checkDay(d).some((p) => p.rule === "lunch"));
});

test("dinner without soup fails (standard and quick)", () => {
  const d = goodDay("2026-10-12");
  d.slots.dinner[4] = r("vegetable");
  assert.ok(checkDay(d).some((p) => p.rule === "dinner-soup"));
  const q = quickDay("2026-10-12");
  q.slots.dinner = [r("onepot")];
  assert.ok(checkDay(q).some((p) => p.rule === "dinner-soup"));
});

test("a one-pot meal cannot be mixed in with the standard dinner dishes", () => {
  const d = goodDay("2026-10-12");
  d.slots.dinner[0] = r("onepot");
  assert.ok(checkDay(d).some((p) => p.rule === "dinner"));
});

test("breakfast and tea breaks are not part of the plan any more (no rule about them)", () => {
  assert.equal(Object.keys(goodDay("2026-10-12").slots).join(","), "lunch,dinner");
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
  a.slots.dinner[0] = a.slots.lunch[0];
  assert.ok(checkNoRepeat([a]).length > 0);
});

test("validatePlan combines all rules", () => {
  assert.equal(validatePlan([goodDay("2026-10-12", "x"), goodDay("2026-10-13", "y")]).length, 0);
});

test("swap check: same recipe 13 days away is blocked, 14 days away is allowed, same day blocked", () => {
  const a = goodDay("2026-10-12", "x");
  const cand = a.slots.lunch[0];
  assert.ok(repeatConflict([a], "2026-10-25", cand)); // 13 days later
  assert.equal(repeatConflict([a], "2026-10-26", cand), null); // 14 days later
  assert.ok(repeatConflict([a], "2026-09-29", cand)); // 13 days earlier
  assert.ok(repeatConflict([a], "2026-10-12", cand)); // same day
});

test("swap check: a recipe not used anywhere is allowed", () => {
  const a = goodDay("2026-10-12", "x");
  assert.equal(repeatConflict([a], "2026-10-13", r("protein", "brand-new")), null);
});

console.log(`\n${passed} tests passed`);
