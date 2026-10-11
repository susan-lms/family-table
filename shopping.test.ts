import assert from "node:assert/strict";
import { buildShoppingList, formatQty } from "./shopping";
import { sampleDays, gingerChicken, gingerFish, garlicBroccoli } from "./sample-data";
import type { PlannedDay } from "./types";

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log("ok -", name); };

test("ginger from chicken (60 g), fish (40 g) and soup (30 g) is added to 130 g", () => {
  const { items } = buildShoppingList([sampleDays[0]]);
  const ginger = items.find((i) => i.name === "Ginger")!;
  // chicken 60 + fish 40 + soup 30 = 130
  assert.equal(ginger.qty, 130);
  assert.equal(items.filter((i) => i.name === "Ginger").length, 1);
});

test("soy sauce in tbsp and tsp stay separate (no wrong unit mixing)", () => {
  const { items } = buildShoppingList([sampleDays[0]]);
  const soy = items.filter((i) => i.name.startsWith("Reduced-sodium"));
  assert.equal(soy.length, 2);
});

test("kg and g are combined", () => {
  const day: PlannedDay = { date: "2026-01-01", slots: { breakfast: [], morning_tea: [], afternoon_tea: [], dinner: [], lunch: [gingerChicken, garlicBroccoli, gingerFish] } };
  const { items } = buildShoppingList([day]);
  assert.equal(items.find((i) => i.name.startsWith("Chicken"))!.qty, 1200);
});

test("recipes with no ingredient list are reported, not guessed", () => {
  const { recipesWithoutDetails } = buildShoppingList([sampleDays[1]]);
  assert.ok(recipesWithoutDetails.length > 0);
});

test("format helper", () => {
  assert.equal(formatQty(1200, "g"), "1.2 kg");
  assert.equal(formatQty(2500, "ml"), "2.5 l");
  assert.equal(formatQty(4, "piece"), "4 pcs");
});

console.log(`\n${passed} tests passed`);
