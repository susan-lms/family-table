import assert from "node:assert/strict";
import { buildShoppingList, formatQty } from "./shopping";
import { gingerChicken, gingerFish, garlicBroccoli, winterMelonSoup } from "./sample-data";
import type { PlannedDay } from "./types";

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log("ok -", name); };

// Lunch (4 people) = half of the 8-person recipes. Dinner (8 people) = full recipes.
const day: PlannedDay = {
  date: "2026-01-01",
  slots: {
    lunch: [gingerChicken, garlicBroccoli],
    dinner: [gingerFish, garlicBroccoli, winterMelonSoup],
  },
};

test("lunch is scaled to 4 people (chicken 1.2 kg -> 600 g)", () => {
  const { items } = buildShoppingList([{ date: "2026-01-01", slots: { lunch: [gingerChicken, garlicBroccoli], dinner: [] } }]);
  assert.equal(items.find((i) => i.name.startsWith("Chicken"))!.qty, 600);
});

test("ginger from lunch chicken (60 g x 0.5) + dinner fish + soup is added into one line", () => {
  const { items } = buildShoppingList([day]);
  const ginger = items.filter((i) => i.name === "Ginger");
  assert.equal(ginger.length, 1);
  const lunchPart = gingerChicken.ingredients!.find((i) => i.name === "Ginger")!.qty * 0.5;
  const fishPart = gingerFish.ingredients!.find((i) => i.name === "Ginger")!.qty;
  const soupPart = winterMelonSoup.ingredients!.find((i) => i.name === "Ginger")!.qty;
  assert.equal(ginger[0].qty, lunchPart + fishPart + soupPart);
});

test("same dish at lunch and dinner is counted for both meals (half + full)", () => {
  const { items } = buildShoppingList([day]);
  const garlic = garlicBroccoli.ingredients!.find((i) => i.name === "Broccoli")!.qty;
  assert.equal(items.find((i) => i.name === "Broccoli")!.qty, garlic * 1.5);
});

test("soy sauce in tbsp and tsp stay separate (no wrong unit mixing)", () => {
  const { items } = buildShoppingList([day]);
  const soy = items.filter((i) => i.name.startsWith("Reduced-sodium"));
  assert.ok(soy.length >= 1);
  assert.equal(new Set(soy.map((i) => i.unit)).size, soy.length);
});

test("recipes with no ingredient list are reported, not guessed", () => {
  const stub = { ...gingerChicken, ingredients: undefined, name: "No details dish" };
  const { recipesWithoutDetails } = buildShoppingList([{ date: "2026-01-01", slots: { lunch: [stub], dinner: [] } }]);
  assert.deepEqual(recipesWithoutDetails, ["No details dish"]);
});

test("pieces are rounded up to whole items", () => {
  const eggDish = { ...gingerChicken, ingredients: [{ name: "Eggs", qty: 5, unit: "piece" as const, category: "Eggs & dairy" as const }] };
  const { items } = buildShoppingList([{ date: "2026-01-01", slots: { lunch: [eggDish], dinner: [] } }]);
  assert.equal(items[0].qty, 3); // 5 x 0.5 = 2.5 -> 3
});

test("format helper", () => {
  assert.equal(formatQty(1200, "g"), "1.2 kg");
  assert.equal(formatQty(2500, "ml"), "2.5 l");
  assert.equal(formatQty(4, "piece"), "4 pcs");
});

console.log(`\n${passed} tests passed`);
