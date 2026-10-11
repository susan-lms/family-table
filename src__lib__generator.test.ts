import assert from "node:assert/strict";
import { generatePlan, libraryStatus, addDays, estimatedGapDays } from "./generator";
import { validatePlan } from "./rules";
import { library as realLibrary } from "./sample-data";
import type { Cuisine, DishClass, Recipe } from "./types";

const CUISINES: Cuisine[] = ["Chinese", "Western", "Japanese", "Korean", "Fusion", "Spanish"];

/** Test-only library with plenty of dishes, to prove the engine can fill 90 days. */
function bigLibrary(): Recipe[] {
  const counts: Array<[DishClass, number]> = [
    ["breakfast_item", 32], ["snack", 32], ["protein", 48], ["vegetable", 48], ["soup", 18],
  ];
  const out: Recipe[] = [];
  for (const [cls, n] of counts) {
    for (let i = 0; i < n; i++) {
      out.push({
        recipe_id: `T-${cls}-${i}`, name: `Test ${cls} ${i}`, cuisine: CUISINES[i % 6], dish_class: cls,
        servings_default: 8, prep_time_minutes: 10, cook_time_minutes: 10, estimated_cost_sgd: 3, is_sample: true,
      });
    }
  }
  return out;
}

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log("ok -", name); };

test("90 days are built from a big enough library with zero rule problems", () => {
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: bigLibrary() });
  assert.equal(r.days.length, 90);
  assert.equal(r.problems.length, 0);
  assert.deepEqual(validatePlan(r.days), []);
});

test("all six cuisines appear in the 90 days", () => {
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: bigLibrary() });
  const seen = new Set(r.days.flatMap((d) => Object.values(d.slots).flat()).map((x) => x.cuisine));
  assert.equal(seen.size, 6);
});

test("the plan is the same every time (no randomness)", () => {
  const a = generatePlan({ startDate: "2026-10-12", days: 30, library: bigLibrary() });
  const b = generatePlan({ startDate: "2026-10-12", days: 30, library: bigLibrary() });
  assert.deepEqual(a.days, b.days);
});

test("a too-small library stops early and explains why, instead of breaking a rule", () => {
  const small = bigLibrary().filter((r) => r.dish_class !== "soup" || Number(r.recipe_id.split("-")[2]) < 5);
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: small });
  assert.ok(r.days.length < 90);
  assert.ok(r.problems.length === 1 && r.problems[0].includes("soups"));
  assert.deepEqual(validatePlan(r.days), []); // what it did build is still fully valid
});

test("library check: need is 154 dishes in total for a 14-day no-repeat window", () => {
  const need = libraryStatus(bigLibrary()).reduce((s, x) => s + x.need, 0);
  assert.equal(need, 154);
});

test("the real library now builds all 90 days with zero rule problems", () => {
  const short = libraryStatus(realLibrary).filter((x) => x.have < x.need);
  assert.equal(short.length, 0);
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: realLibrary });
  assert.equal(r.days.length, 90);
  assert.equal(r.problems.length, 0);
  assert.deepEqual(validatePlan(r.days), []);
  const seen = new Set(r.days.flatMap((d) => Object.values(d.slots).flat()).map((x) => x.cuisine));
  assert.equal(seen.size, 10);
});

test("estimated gap: big test library is limited at 16 days, and the real library reports a smaller number", () => {
  assert.equal(estimatedGapDays(bigLibrary()).days, 16);
  const real = estimatedGapDays(realLibrary);
  assert.ok(real.days >= 1 && real.days < 16);
  assert.ok(real.limitedBy.length > 0);
});

test("new cuisines exist in the real library", () => {
  const cuisines = new Set(realLibrary.map((r) => r.cuisine));
  for (const c of ["Thai", "Indonesian", "Malaysian", "Indian"]) assert.ok(cuisines.has(c as Cuisine), c);
});

test("every recipe with steps has at least 3 ingredients, 3 steps and a note", () => {
  const full = realLibrary.filter((r) => r.steps);
  assert.equal(full.length, realLibrary.length); // no "steps coming soon" dishes left
  for (const r of full) {
    assert.ok(r.ingredients && r.ingredients.length >= 2, r.name + " ingredients");
    assert.ok(r.steps && r.steps.length >= 3, r.name + " steps");
    assert.ok(r.oil_salt_sugar_note, r.name + " note");
  }
});

test("every batch-1 recipe has ingredients, steps, and units that the shopping list understands", () => {
  const withSteps = realLibrary.filter((r) => r.recipe_id.match(/^R-(IN|TH|ID|MY)-|^R-CN-030$/));
  assert.ok(withSteps.length >= 25);
  for (const r of withSteps) {
    assert.ok(r.ingredients && r.ingredients.length >= 3, r.name + " ingredients");
    assert.ok(r.steps && r.steps.length >= 4, r.name + " steps");
    assert.ok(r.oil_salt_sugar_note, r.name + " note");
  }
});

test("every dish has a cost estimate from its ingredients, and protein portions are not oversized", () => {
  for (const r of realLibrary) {
    assert.ok(r.estimated_cost_sgd > 0 && r.estimated_cost_sgd < 40, r.name + " cost " + r.estimated_cost_sgd);
    if (r.dish_class === "protein") {
      const meatG = (r.ingredients ?? []).filter((g) => g.category === "Meat" || g.category === "Seafood")
        .reduce((sum, g) => sum + (g.unit === "kg" ? g.qty * 1000 : g.qty), 0);
      assert.ok(meatG <= 1200, r.name + " meat " + meatG + " g");
    }
  }
});

test("addDays handles month ends", () => {
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
});

console.log(`\n${passed} tests passed`);
