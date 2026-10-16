import { catalog, findRecipe, library, setUserRecipes } from "./sample-data";
import { parseIngredientLine, parseIngredients, parseSteps, parsePasted, buildRecipe, validateDraft, draftFromRecipe, isMine } from "./my-recipes";
let fail = 0;
const ok = (c: boolean, m: string) => { if (c) console.log("ok -", m); else { fail++; console.error("FAIL -", m); } };
const p = parseIngredientLine;
ok(p("200 g chicken breast, sliced")?.qty === 200 && p("200 g chicken breast, sliced")?.unit === "g" && p("200 g chicken breast, sliced")?.prep === "sliced", "g + prep");
ok(p("200g chicken")?.unit === "g" && p("200g chicken")?.name === "Chicken", "stuck unit");
ok(p("2 tbsp light soy sauce")?.unit === "tbsp" && p("2 tbsp light soy sauce")?.name === "Light soy sauce", "tbsp");
ok(p("1 1/2 cups water")?.qty === 360 && p("1 1/2 cups water")?.unit === "ml", "mixed fraction cups to ml");
ok(p("½ tsp white pepper")?.qty === 0.5, "unicode fraction");
ok(p("1 lb pork")?.qty === 454 && p("1 lb pork")?.unit === "g", "lb to g");
ok(p("3 cloves garlic")?.unit === "piece" && p("3 cloves garlic")?.name === "Garlic", "cloves");
ok(p("2 onions")?.unit === "piece" && p("2 onions")?.qty === 2, "count");
ok(p("2-3 carrots")?.qty === 3, "range takes upper");
ok(p("salt to taste")?.guessed === true && p("salt to taste")?.qty === 1, "no amount is flagged");
ok(p("   ") === null, "blank line");
ok(p("- 400 ml coconut milk")?.qty === 400, "bullet removed");
ok(p("1 chicken breast")?.category === "Meat" && p("2 cups spinach")?.category === "Vegetables" && p("1 tsp black pepper")?.category === "Pantry" && p("2 eggs")?.category === "Eggs & dairy" && p("300 g prawns")?.category === "Seafood" && p("1 lemon")?.category === "Fruit", "categories");
ok(parseSteps("1. Boil water.\n2) Add rice.\nStep 3: Serve.").join("|") === "Boil water.|Add rice.|Serve.", "steps numbering stripped");
const pasted = parsePasted(`Easy Chicken Rice
Prep time: 15 mins
Cook time: 1 hour 10 minutes
Serves 4

Ingredients
500 g chicken thigh
2 cups jasmine rice
3 cloves garlic

Method
1. Rub the chicken with garlic.
2. Cook the rice with the chicken for 30 minutes.
3. Slice and serve.`);
ok(pasted.name === "Easy Chicken Rice" && pasted.prep === 15 && pasted.cook === 70 && pasted.serves === 4, "paste: name, times, serves");
ok(pasted.ingredients.split("\n").length === 3 && pasted.steps.split("\n").length === 3, "paste: sections");
const nohead = parsePasted("Plain porridge\n1 cup rice\n8 cups water\nBoil the rice in the water for an hour.");
ok(nohead.ingredients.split("\n").length === 2 && nohead.steps.split("\n").length === 1, "paste without headings");
const draft = { name: "Granny's chicken rice", name_zh: "外婆鸡饭", cuisineId: "hokkien", typeId: "onedish", prep: 15, cook: 40, serves: 4, ingredients: pasted.ingredients, steps: pasted.steps, source: "Granny" };
ok(validateDraft(draft).length === 0, "valid draft");
ok(validateDraft({ ...draft, name: "", steps: "" }).length === 2, "invalid draft gives 2 messages");
const r = buildRecipe(draft, "R-MY-test1");
ok(isMine(r) && r.mine === true && r.browse === true && r.servings_default === 8, "flags");
ok(r.ingredients![0].qty === 1000, "amounts scaled from 4 to 8 people");
ok(r.cuisine === "Chinese" && r.region === "Hokkien" && r.dish_class === "onedish", "cuisine and type");
ok(r.estimated_cost_sgd > 0, "cost estimated");
ok(r.steps!.length === 3 && r.name_zh === "外婆鸡饭" && r.source === "Granny", "steps, zh name, source");
const back = draftFromRecipe(r);
ok(back.cuisineId === "hokkien" && back.typeId === "onedish" && back.serves === 8 && parseIngredients(back.ingredients).length === 3, "round trip to the form");
const again = buildRecipe(back, "R-MY-test1");
ok(again.ingredients![0].qty === 1000, "edit and save again does not change amounts");
const before = catalog.length, libBefore = library.length;
setUserRecipes([r]);
ok(findRecipe("R-MY-test1")?.name === "Granny's chicken rice" && catalog.length === before + 1, "registry: my recipe can be found");
setUserRecipes([r, { ...r, recipe_id: "R-MY-test2", name: "Second" }]);
ok(catalog.length === before + 2, "registry: two recipes");
setUserRecipes([]);
ok(catalog.length === before && !findRecipe("R-MY-test1"), "registry: removing them clears the catalog");
ok(library.length === libBefore && !library.some((x) => x.mine), "meal planner library is never touched");
const g = buildRecipe({ ...draft, ingredients: "salt to taste\n200 g chicken" }, "R-MY-g");
ok(g.ingredients![0].qty === 1 && g.ingredients![1].qty === 400, "no-amount lines are not scaled");
console.log(fail ? `${fail} FAILED` : "my-recipes: all passed");
process.exit(fail ? 1 : 0);
