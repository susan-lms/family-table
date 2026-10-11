import assert from "node:assert/strict";
import { library, festivalLibrary } from "./sample-data";
import { baselinePlan } from "./plan-data";
import { generatePlan, isMeatFree } from "./generator";
import { validatePlan, checkDay } from "./rules";
import { suggestDinner, suggestLunch } from "./dinner-mode";
import { FESTIVALS, festivalDishes } from "./festivals";
import { DEFAULT_PEOPLE, avoidWarnings, dishMatches } from "./people";
import { FRUITS, dayProteinPerPerson, fruitFor, isCalciumRich, recipeProtein } from "./nutrition";
import { buildShoppingList } from "./shopping";
import { isMeatFreeDay } from "./servings";
import { ingredientZh } from "./zh-ingredients";
import { isSoft } from "./softness";

let n = 0;
const t = (name: string, f: () => void) => { f(); n++; console.log("ok -", name); };

t("default plan: 90 valid days", () => {
  assert.equal(baselinePlan.length, 90);
  assert.deepEqual(validatePlan(baselinePlan), []);
});
t("Thursdays are meat-free all day", () => {
  const thu = baselinePlan.filter((d) => isMeatFreeDay(d.date));
  assert.ok(thu.length >= 12);
  for (const d of thu) for (const r of [...d.slots.lunch, ...d.slots.dinner]) assert.ok(isMeatFree(r), `${d.date} ${r.name}`);
});
t("meat-free days still get 2 proteins and 2 vegetables at dinner (no one-pot)", () => {
  for (const d of baselinePlan.filter((x) => isMeatFreeDay(x.date))) {
    assert.equal(d.slots.dinner.filter((r) => r.dish_class === "protein").length, 2);
    assert.equal(d.slots.dinner.filter((r) => r.dish_class === "onepot").length, 0);
  }
});
t("other weekly patterns also build 90 valid days", () => {
  const g = generatePlan({ startDate: "2026-10-12", days: 90, library, quickWeekdays: [2, 4], meatFreeWeekdays: [6] });
  assert.equal(g.days.length, 90);
  assert.deepEqual(validatePlan(g.days), []);
  const none = generatePlan({ startDate: "2026-10-12", days: 90, library, meatFreeWeekdays: [] });
  assert.equal(none.days.length, 90);
});
t("festival dishes never appear in the normal plan or library", () => {
  const ids = new Set(festivalLibrary.map((r) => r.recipe_id));
  assert.equal(festivalLibrary.length, 20);
  assert.ok(library.every((r) => !ids.has(r.recipe_id)));
  assert.ok(baselinePlan.every((d) => [...d.slots.lunch, ...d.slots.dinner].every((r) => !ids.has(r.recipe_id))));
});
t("every festival menu is a valid dinner (2 protein, 2 vegetable, 1 soup) with a full recipe", () => {
  for (const f of FESTIVALS) {
    const dishes = festivalDishes(f);
    assert.equal(dishes.length, 5, f.id);
    assert.ok(dishes.every((r) => r.steps && r.ingredients && r.name_zh));
    const day = { date: f.date, slots: { lunch: baselinePlan[0].slots.lunch, dinner: dishes } };
    assert.deepEqual(checkDay(day), [], f.id);
  }
});
t("festival menus can be put on their dates inside the plan", () => {
  for (const f of FESTIVALS.filter((x) => baselinePlan.some((d) => d.date === x.date))) {
    const days = baselinePlan.map((d) => (d.date === f.date ? { ...d, slots: { ...d.slots, dinner: festivalDishes(f) } } : d));
    assert.deepEqual(validatePlan(days), [], f.id);
  }
});
t("quick-night button: every full dinner can become a one-pot night and back", () => {
  let tried = 0;
  for (const d of baselinePlan.slice(0, 60)) {
    if (isMeatFreeDay(d.date) || d.slots.dinner.some((r) => r.dish_class === "onepot")) continue;
    const q = suggestDinner(baselinePlan, d.date, "quick", library);
    assert.ok(q.ok, `${d.date} ${q.ok ? "" : q.message}`);
    if (q.ok) {
      assert.equal(q.dishes.length, 2);
      const days = baselinePlan.map((x) => (x.date === d.date ? { ...x, slots: { ...x.slots, dinner: q.dishes } } : x));
      assert.deepEqual(validatePlan(days), []);
      tried++;
    }
  }
  assert.ok(tried > 10);
  const oneDay = baselinePlan.find((d) => d.slots.dinner.some((r) => r.dish_class === "onepot")) as (typeof baselinePlan)[number];
  const back = suggestDinner(baselinePlan, oneDay.date, "full", library);
  assert.ok(back.ok && back.dishes.length === 5);
});
t("quick-night button is refused on a meat-free day", () => {
  const thu = baselinePlan.find((d) => isMeatFreeDay(d.date)) as (typeof baselinePlan)[number];
  assert.equal(suggestDinner(baselinePlan, thu.date, "quick", library).ok, false);
});
t("protein estimate is sane", () => {
  assert.ok(library.filter((r) => r.dish_class === "protein").every((r) => recipeProtein(r) > 10 && recipeProtein(r) < 400));
  const avg = baselinePlan.reduce((s, d) => s + dayProteinPerPerson(d).both, 0) / baselinePlan.length;
  assert.ok(avg > 45 && avg < 75, String(avg));
});
t("calcium tag finds tofu and greens", () => {
  assert.ok(library.filter(isCalciumRich).length > 40);
});
t("fruit after dinner: 7 fruits rotate and go on the shopping list", () => {
  assert.equal(new Set(baselinePlan.slice(0, 7).map((d) => fruitFor(d.date).name)).size, 7);
  assert.ok(FRUITS.every((f) => ingredientZh(f.name)));
  const { items } = buildShoppingList(baselinePlan.slice(0, 7));
  assert.ok(items.filter((i) => i.category === "Fruit").length >= 7);
});
t("family notes: avoid words match ingredients, types and allergens", () => {
  const prawn = library.find((r) => /prawn/i.test(r.name)) as (typeof library)[number];
  assert.ok(dishMatches(prawn, "prawns").length > 0);
  assert.ok(dishMatches(prawn, "shellfish").length > 0);
  const beef = library.find((r) => r.dish_class === "protein" && /beef/i.test(r.name)) as (typeof library)[number];
  assert.ok(dishMatches(beef, "beef").length > 0);
  const day = baselinePlan.find((d) => [...d.slots.lunch, ...d.slots.dinner].some((r) => /beef/i.test(r.name) || r.ingredients?.some((g) => /beef/i.test(g.name))));
  assert.ok(day);
  const people = DEFAULT_PEOPLE.map((p, k) => (k === 0 ? { ...p, avoid: "beef" } : p));
  assert.ok(avoidWarnings(day!, people).length > 0);
  assert.equal(avoidWarnings(day!, DEFAULT_PEOPLE).length, 0);
});
t("porridge menu has plain, fish, chicken and pork; noodles include bee hoon and kway teow; sandwiches exist", () => {
  const od = library.filter((r) => r.dish_class === "onedish");
  const por = od.filter((r) => r.meal === "porridge");
  assert.ok(por.length >= 15);
  assert.ok(por.some((r) => /^plain porridge/i.test(r.name)));
  for (const k of ["fish", "chicken", "pork"]) assert.ok(por.some((r) => new RegExp(k, "i").test(r.name)), k);
  assert.ok(od.some((r) => /bee hoon/i.test(r.name)) && od.some((r) => /kway teow/i.test(r.name)));
  assert.ok(od.filter((r) => r.meal === "sandwich").length >= 5);
  assert.ok(od.every((r) => r.steps && r.ingredients && r.name_zh));
  assert.ok(por.every(isSoft));
});
t("lunch button: one-dish lunch and back, always valid", () => {
  let tried = 0;
  for (const d of baselinePlan.slice(0, 40)) {
    const isOne = d.slots.lunch.some((r) => r.dish_class === "onedish");
    const c = suggestLunch(baselinePlan, d.date, isOne ? "standard" : "onedish", library);
    assert.ok(c.ok, `${d.date} ${c.ok ? "" : c.message}`);
    if (c.ok) {
      const days = baselinePlan.map((x) => (x.date === d.date ? { ...x, slots: { ...x.slots, lunch: c.dishes } } : x));
      assert.deepEqual(validatePlan(days), [], d.date);
      tried++;
    }
  }
  assert.equal(tried, 40);
});
t("noodle-night button works on rice nights and is valid", () => {
  const d = baselinePlan.find((x) => x.slots.dinner.length === 5) as (typeof baselinePlan)[number];
  const c = suggestDinner(baselinePlan, d.date, "noodle", library);
  assert.ok(c.ok && c.dishes.length === 2 && c.dishes[0].dish_class === "onedish" && c.dishes[0].meal !== "porridge");
});
t("another weekly pattern with different one-dish days still builds 90 valid days", () => {
  const g = generatePlan({ startDate: "2026-10-12", days: 90, library, lunchOneDishWeekdays: [1, 3, 5], noodleDinnerWeekdays: [0, 6] });
  assert.equal(g.days.length, 90);
  assert.deepEqual(validatePlan(g.days), []);
});
console.log(`${n} passed`);
