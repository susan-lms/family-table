import assert from "node:assert/strict";
import { library } from "./sample-data";
import { baselinePlan } from "./plan-data";
import { isSoft } from "./softness";
import { SODIUM_LIMIT_MG, daySodiumPerPerson, recipeSodium } from "./sodium";
import { ingredientZh } from "./zh-ingredients";

let n = 0;
const t = (name: string, f: () => void) => { f(); n++; console.log("ok -", name); };

t("every dish has a Chinese name", () => {
  const missing = library.filter((r) => !r.name_zh || !/[一-鿿]/.test(r.name_zh)).map((r) => r.name);
  assert.deepEqual(missing, []);
});
t("every ingredient has a Chinese name", () => {
  const missing = new Set<string>();
  for (const r of library) for (const g of r.ingredients ?? []) if (!ingredientZh(g.name)) missing.add(g.name);
  assert.deepEqual([...missing], []);
});
t("every lunch has a soft protein dish", () => {
  const bad = baselinePlan.filter((d) => !d.slots.lunch.some((r) => r.dish_class === "protein" && isSoft(r)));
  assert.equal(bad.length, 0);
});
t("at least 95% of dinners have a soft main dish", () => {
  const ok = baselinePlan.filter((d) => d.slots.dinner.some((r) => (r.dish_class === "protein" || r.dish_class === "onepot") && isSoft(r)));
  assert.ok(ok.length / baselinePlan.length >= 0.95, `${ok.length}/${baselinePlan.length}`);
});
t("soups are soft; crispy fried dishes are not", () => {
  assert.ok(library.filter((r) => r.dish_class === "soup").every(isSoft));
  const crispy = library.filter((r) => /crispy|fried chicken|nugget/i.test(r.name));
  assert.ok(crispy.every((r) => !isSoft(r)));
});
t("no planned day is over the 2,000 mg sodium limit", () => {
  const over = baselinePlan.filter((d) => daySodiumPerPerson(d) > SODIUM_LIMIT_MG);
  assert.equal(over.length, 0);
});
t("sodium estimator is sane", () => {
  assert.ok(library.every((r) => recipeSodium(r) >= 0 && recipeSodium(r) < 16000));
  const avg = baselinePlan.reduce((s, d) => s + daySodiumPerPerson(d), 0) / baselinePlan.length;
  assert.ok(avg > 300 && avg < 1800, String(avg));
});
console.log(`${n} passed`);
