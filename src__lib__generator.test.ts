import assert from "node:assert/strict";
import { generatePlan, libraryStatus, addDays, estimatedGapDays } from "./generator";
import { validatePlan, checkTreats, repeatConflict, checkDay } from "./rules";
import { isQuickNight } from "./servings";
import { mainProtein } from "./protein";
import { library as realLibrary } from "./sample-data";
import type { Cuisine, DishClass, Recipe } from "./types";

const CUISINES: Cuisine[] = ["Chinese", "Western", "Japanese", "Korean", "Fusion", "Spanish"];

/** Test-only library with plenty of dishes, to prove the engine can fill 90 days. */
function bigLibrary(): Recipe[] {
  const counts: Array<[DishClass, number]> = [["protein", 48], ["vegetable", 48], ["soup", 18], ["onepot", 12]];
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

test("every dinner has a soup, and lunch has exactly one protein and one vegetable", () => {
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: bigLibrary() });
  for (const d of r.days) {
    assert.equal(d.slots.dinner.filter((x) => x.dish_class === "soup").length, 1, d.date);
    assert.equal(d.slots.lunch.length, 2);
    assert.deepEqual(checkDay(d), []);
  }
});

test("quick one-pot dinners fall on Mon, Wed and Fri; other nights are standard", () => {
  const r = generatePlan({ startDate: "2026-10-12", days: 28, library: bigLibrary() });
  for (const d of r.days) {
    const hasOnePot = d.slots.dinner.some((x) => x.dish_class === "onepot");
    assert.equal(hasOnePot, isQuickNight(d.date), d.date);
    assert.equal(d.slots.dinner.length, hasOnePot ? 2 : 5, d.date);
  }
  assert.equal(isQuickNight("2026-10-12"), true); // Monday
  assert.equal(isQuickNight("2026-10-13"), false); // Tuesday
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
  assert.deepEqual(validatePlan(r.days), []);
});

test("library check: 14 days need 30 protein, 30 vegetable, 14 soup and 6 one-pot dishes", () => {
  const need = Object.fromEntries(libraryStatus(bigLibrary()).map((s) => [s.dishClass, s.need]));
  assert.deepEqual(need, { protein: 30, vegetable: 30, soup: 14, onepot: 6 });
});

test("the real library builds all 90 days with zero rule problems and all 9 cuisines (Indian is switched off)", () => {
  const short = libraryStatus(realLibrary).filter((x) => x.have < x.need);
  assert.equal(short.length, 0);
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: realLibrary });
  assert.equal(r.days.length, 90);
  assert.equal(r.problems.length, 0);
  assert.deepEqual(validatePlan(r.days), []);
  const seen = new Set(r.days.flatMap((d) => [...d.slots.lunch, ...d.slots.dinner]).map((x) => x.cuisine));
  assert.equal(seen.size, 9);
  assert.ok(!seen.has("Indian"));
});

test("real plan serves chicken, pork, beef, fish and seafood regularly (at least 15 times each in 90 days)", () => {
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: realLibrary });
  const count: Record<string, number> = {};
  for (const d of r.days) for (const x of [...d.slots.lunch, ...d.slots.dinner]) {
    if (x.dish_class === "protein" || x.dish_class === "onepot") count[mainProtein(x)] = (count[mainProtein(x)] ?? 0) + 1;
  }
  for (const t of ["chicken", "pork", "beef", "fish", "seafood"]) assert.ok((count[t] ?? 0) >= 15, `${t}: ${count[t]}`);
});

test("real library has at least 20 quick one-pot meals, including a salmon bento and claypot/fried rice", () => {
  const onepots = realLibrary.filter((r) => r.dish_class === "onepot");
  assert.ok(onepots.length >= 20);
  assert.ok(onepots.some((r) => /bento/i.test(r.name) && /salmon/i.test(r.name)));
  assert.ok(onepots.some((r) => /claypot/i.test(r.name)));
  assert.ok(onepots.some((r) => /fried rice/i.test(r.name)));
  for (const r of onepots) assert.ok(r.prep_time_minutes + r.cook_time_minutes <= 60, r.name + " is not quick");
});

test("estimated gap: the big test library has a sensible gap, and the real library reports one", () => {
  assert.ok(estimatedGapDays(bigLibrary()).days >= 16);
  const real = estimatedGapDays(realLibrary);
  assert.ok(real.days >= 14 && real.days <= 90);
  assert.ok(real.limitedBy.length > 0);
});

test("new cuisines exist in the real library", () => {
  const cuisines = new Set(realLibrary.map((r) => r.cuisine));
  for (const c of ["Thai", "Indonesian", "Malaysian"]) assert.ok(cuisines.has(c as Cuisine), c);
});

test("every dish served has ingredients, steps and a low oil/salt/sugar note", () => {
  assert.ok(realLibrary.length >= 150);
  for (const r of realLibrary) {
    assert.ok(r.ingredients && r.ingredients.length >= 2, r.name + " ingredients");
    assert.ok(r.steps && r.steps.length >= 3, r.name + " steps");
    assert.ok(r.oil_salt_sugar_note, r.name + " note");
  }
});

test("breakfast items and snacks are not in the planned library", () => {
  assert.equal(realLibrary.filter((r) => r.dish_class === "breakfast_item" || r.dish_class === "snack").length, 0);
});

test("every dish has a cost estimate, and protein portions are not oversized", () => {
  for (const r of realLibrary) {
    assert.ok(r.estimated_cost_sgd > 0 && r.estimated_cost_sgd < 40, r.name + " cost " + r.estimated_cost_sgd);
    if (r.dish_class === "protein") {
      const meatG = (r.ingredients ?? []).filter((g) => g.category === "Meat" || g.category === "Seafood")
        .reduce((sum, g) => sum + (g.unit === "kg" ? g.qty * 1000 : g.qty), 0);
      assert.ok(meatG <= 1200, r.name + " meat " + meatG + " g");
    }
  }
});

test("lunch cost is half and the daily cost stays at or under S$80 in the real plan", () => {
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: realLibrary });
  assert.equal(r.warnings.length, 0, r.warnings.slice(0, 3).join(" | "));
});

test("treat (deep-fried) dishes: allowed at most once in any 7 days", () => {
  const treats = realLibrary.filter((r) => r.treat);
  assert.ok(treats.length >= 3);
  const r = generatePlan({ startDate: "2026-10-12", days: 90, library: realLibrary });
  assert.deepEqual(checkTreats(r.days), []);
  const treatDays = r.days.filter((d) => [...d.slots.lunch, ...d.slots.dinner].some((x) => x.treat));
  if (treatDays.length > 0) {
    const first = treatDays[0];
    const other = treats.find((t) => ![...first.slots.lunch, ...first.slots.dinner].some((x) => x.recipe_id === t.recipe_id));
    assert.ok(other);
    assert.ok(repeatConflict(r.days, addDays(first.date, 3), other!));
  }
});

test("the library has plenty of stir-fry and low-oil fried dishes", () => {
  const n = realLibrary.filter((r) => /stir-fr|air-fr|pan-fr|oven/i.test(r.name)).length;
  assert.ok(n >= 20, "found " + n);
});

test("addDays handles month ends", () => {
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
});

console.log(`\n${passed} tests passed`);
