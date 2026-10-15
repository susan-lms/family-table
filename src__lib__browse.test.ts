import { catalog, browseRecipes, library, festivalLibrary, findRecipe } from "./sample-data";
import { CUISINES, TYPES, totalMinutes, cuisineIdOf } from "./browse";
import { CUISINE_TONE, TYPE_TONE } from "./theme";
import { buildRecipeShoppingList, buildShoppingList, mergeShoppingLists } from "./shopping";
import { recipeSodium } from "./sodium";
import { mainProtein } from "./protein";
import { generatePlan } from "./generator";
import { validatePlan } from "./rules";
let n = 0;
const ok = (c: boolean, m: string) => { if (!c) { console.error("FAIL -", m); process.exit(1); } n++; console.log("ok -", m); };

ok(browseRecipes.length >= 180, `recipe book has ${browseRecipes.length} new dishes`);
ok(browseRecipes.every((r) => totalMinutes(r) <= 120), "every new recipe takes 2 hours or less");
ok(browseRecipes.filter((r) => totalMinutes(r) <= 30).length >= 80, "at least 80 new recipes are still 30 minutes or less");
ok(browseRecipes.every((r) => r.browse && !!r.name_zh && (r.steps?.length ?? 0) >= 3 && (r.ingredients?.length ?? 0) >= 3), "every new recipe is browse-only, has a Chinese name, steps and ingredients");
ok(browseRecipes.every((r) => r.ingredients!.every((g) => g.qty > 0)), "all ingredient amounts are positive");
ok(new Set(catalog.map((r) => r.recipe_id)).size === catalog.length, "no duplicate recipe ids in the catalog");
ok(new Set(catalog.map((r) => r.name.toLowerCase())).size === catalog.length, "no duplicate dish names in the catalog");
ok(library.every((r) => !r.browse) && festivalLibrary.every((r) => !r.browse), "the meal planner never uses recipe-book dishes");
ok(!library.some((r) => r.cuisine === "Mexican"), "no Mexican-style dish enters the planner pool");
for (const c of CUISINES) {
  const quick = catalog.filter((r) => c.test(r) && r.cuisine !== "Indian" && totalMinutes(r) <= 30);
  ok(c.id === "other" || quick.length >= 5, `cuisine "${c.label}" has ${quick.length} quick recipes`);
}
const countType = (id: string) => catalog.filter((r) => TYPES.find((t) => t.id === id)!.test(r) && totalMinutes(r) <= 30).length;
for (const t of TYPES) ok(countType(t.id) >= 5, `type "${t.label}" has ${countType(t.id)} quick recipes`);
const meats = ["chicken", "pork", "beef", "lamb"];
for (const m of meats) ok(catalog.some((r) => TYPES[1].test(r) && mainProtein(r) === m && totalMinutes(r) <= 30), `quick ${m} dish exists`);
ok(browseRecipes.filter((r) => r.dish_class === "pie" && r.sweet).length >= 7 && browseRecipes.filter((r) => r.dish_class === "pie" && !r.sweet).length >= 7, "at least 7 savoury and 7 sweet pies");
for (const g of ["Cantonese", "Teochew", "Hokkien", "Hakka"] as const) ok(browseRecipes.filter((r) => r.region === g).length >= 28, `${g} has ${browseRecipes.filter((r) => r.region === g).length} dishes and soups`);
ok((["Cantonese", "Teochew", "Hokkien", "Hakka"] as const).every((g) => browseRecipes.filter((r) => r.region === g && r.dish_class === "soup").length >= 2 && browseRecipes.filter((r) => r.region === g && r.dish_class !== "soup").length >= 6), "each Chinese region has 6+ dishes and 2+ soups");
ok(findRecipe("R-LB-001")?.name === "Cumin lamb stir-fry" && !!findRecipe("R-CN-001"), "findRecipe finds recipe-book and planner dishes");
const heavy = browseRecipes.filter((r) => recipeSodium(r) / 8 > 800);
ok(heavy.length === 0, `no recipe-book dish has over 800 mg sodium per person ${heavy.map((r) => r.name + " " + Math.round(recipeSodium(r) / 8))}`);

const list = buildRecipeShoppingList([{ recipe: findRecipe("R-CT-004")!, servings: 4 }, { recipe: findRecipe("R-CT-004")!, servings: 2 }]);
const eggs = list.find((x) => x.name === "Eggs");
ok(eggs?.qty === 6, "saved shopping list adds the same recipe and scales to 4 + 2 people (8 eggs -> 4 + 2 = 6)");
ok(!list.some((x) => /water/i.test(x.name)), "tap water is not on the shopping list");

const plan = generatePlan({ startDate: "2026-10-12", days: 90, library });
ok(plan.days.length === 90 && validatePlan(plan.days).length === 0, "the 90-day meal plan is still valid");
ok(CUISINES.every((c) => !!CUISINE_TONE[c.id]) && TYPES.every((t) => !!TYPE_TONE[t.id]), "every cuisine tile and dish type has a colour");
ok(catalog.every((r) => !!CUISINE_TONE[cuisineIdOf(r)]), "every recipe maps to a cuisine colour");
ok(new Set(CUISINES.map((c) => CUISINE_TONE[c.id].on)).size === CUISINES.length, "each cuisine has its own colour");
const merged = mergeShoppingLists(buildShoppingList(plan.days.slice(0, 1)).items, buildRecipeShoppingList([{ recipe: findRecipe("R-CT-004")!, servings: 8 }]));
const mEggs = merged.find((x) => x.name === "Eggs");
const pEggs = buildShoppingList(plan.days.slice(0, 1)).items.find((x) => x.name === "Eggs")?.qty ?? 0;
ok(!!mEggs && Math.abs(mEggs.qty - (pEggs + 8)) < 1e-9, "added recipes are summed into the plan shopping list (eggs add up)");
// swapping in a recipe-book dish: the rules engine still checks the day
import { checkDay } from "./rules";
{
  const d = plan.days[3];
  const protein = d.slots.dinner.findIndex((r) => r.dish_class === "protein");
  const pool = catalog.filter((r) => r.dish_class === "protein" && r.browse && !r.festival);
  ok(pool.length >= 60, `${pool.length} recipe-book protein dishes can be offered in the swap list`);
  const swapped = { ...d, slots: { ...d.slots, dinner: d.slots.dinner.map((r, k) => (k === protein ? pool[0] : r)) } };
  ok(Array.isArray(checkDay(swapped)), "a day with a recipe-book dish swapped in can still be checked by the meal rules");
}
console.log(n, "passed");
