import type { Ingredient, PlannedDay, Recipe } from "./types";

/**
 * ROUGH sodium estimates (mg) so the app can show a daily salt check.
 * Sources: sauces from HealthHub Singapore ("Let's get saucy": fish sauce 1,012 mg, oyster sauce 580 mg,
 * light soy sauce 860 mg, kecap manis 227 mg per tablespoon). Salt: 1 teaspoon = about 5 g = 2,000 mg sodium
 * (Health Promotion Board: 5 g salt = 2,000 mg sodium).
 * ASSUMPTIONS (not verified): low-salt soy sauce about 40% less than regular (520 mg/tbsp); low-salt miso 400 mg/tbsp;
 * natural sodium of fresh food is a typical average; dried seaweed, canned foods, bread and wheat noodles (udon, egg noodles, mee sua, soba) are guesses.
 * Table salt or sauce added at the table is NOT counted.
 */
interface Rule { re: RegExp; tbsp?: number; tsp?: number; per100?: number; each?: number }

const RULES: Rule[] = [
  // recipe-book additions. ASSUMPTIONS (not verified): salty preserved foods are counted after rinsing, so about half of their raw saltiness.
  { re: /grated cheese/i, per100: 600 },
  { re: /salted egg/i, each: 400 }, // yolk only
  { re: /preserved radish|chai poh/i, per100: 1500 },
  { re: /salted mustard|preserved mustard/i, per100: 1500 },
  { re: /mustard greens/i, per100: 60 }, // fresh gai choy
  { re: /dried shrimp|dried squid/i, per100: 1500 },
  { re: /popiah skin/i, each: 80 },
  { re: /bean paste|bean sauce/i, tbsp: 450 },
  { re: /puff pastry sheet/i, each: 900 },
  { re: /fish balls/i, per100: 500 },
  { re: /black beans/i, per100: 120 }, // canned, rinsed
  { re: /kecap manis|sweet soy/i, tbsp: 227 },
  { re: /oyster sauce/i, tbsp: 580 },
  { re: /fish sauce/i, tbsp: 1012 },
  { re: /low-salt miso|miso/i, tbsp: 400 },
  { re: /soy sauce/i, tbsp: 520 }, // low-salt soy sauce (assumed ~40% less than the 860 mg regular)
  { re: /^salt$/i, tsp: 2000 },
  { re: /shaoxing/i, tbsp: 150 },
  { re: /mirin/i, tbsp: 5 },
  { re: /vinegar/i, tbsp: 2 },
  { re: /wakame/i, per100: 3000 },
  { re: /canned tuna/i, per100: 300 },
  { re: /canned (chickpeas|white beans)/i, per100: 120 },
  { re: /canned tomatoes/i, per100: 20 },
  { re: /breadcrumbs/i, per100: 700 },
  { re: /wraps/i, each: 250 },
  { re: /wrappers/i, each: 60 },
  { re: /puff pastry/i, each: 150 },
  { re: /wholemeal bread/i, each: 150 },
  { re: /udon/i, per100: 300 }, // assumption: fresh udon is salted
  { re: /egg noodles/i, per100: 200 }, // assumption
  { re: /mee sua/i, per100: 800 }, // assumption: dried wheat vermicelli is salted
  { re: /soba/i, per100: 150 }, // assumption
  { re: /cheese/i, each: 250 },
  { re: /prawn|squid|clam|mussel|scallop/i, per100: 150 },
  { re: /^eggs?$|hard-boiled/i, each: 62 },
  { re: /tofu|tempeh/i, per100: 10 },
  { re: /coconut milk/i, per100: 15 },
  { re: /tomato paste/i, tbsp: 10 },
  { re: /curry powder|garam masala|paprika|cumin|turmeric|pepper|cinnamon|nutmeg|thyme|oregano|basil|herbs|dill|five-spice|star anise/i, tsp: 2, tbsp: 6 },
  { re: /rice|flour|oats|noodles|vermicelli|semolina|cornflour|sugar|oil|water|lentils|beans$/i, per100: 5 },
];

const CATEGORY_PER100: Record<string, number> = { Vegetables: 40, Fruit: 5, Meat: 70, Seafood: 90, "Eggs & dairy": 50, Pantry: 20, Other: 0 };

export function ingredientSodium(ing: Ingredient): number {
  const rule = RULES.find((r) => r.re.test(ing.name));
  const q = ing.qty;
  switch (ing.unit) {
    case "tbsp": return q * (rule?.tbsp ?? (rule?.tsp ? rule.tsp * 3 : 5));
    case "tsp": return q * (rule?.tsp ?? (rule?.tbsp ? rule.tbsp / 3 : 2));
    case "piece": return q * (rule?.each ?? 15);
    default: {
      const grams = ing.unit === "kg" || ing.unit === "l" ? q * 1000 : q;
      const per100 = rule?.per100 ?? CATEGORY_PER100[ing.category] ?? 20;
      return (grams / 100) * per100;
    }
  }
}

/** Sodium (mg) in one full recipe (written for 8 people). */
export const recipeSodium = (r: Recipe): number => (r.ingredients ?? []).reduce((s, g) => s + ingredientSodium(g), 0);

/**
 * Rough sodium per person for a day, if everyone eats everything.
 * Lunch is cooked for 4 and dinner for 8, so each is half or full of an 8-person recipe divided by the people eating:
 * either way, one person eats 1/8 of every recipe on the plan.
 */
export function daySodiumPerPerson(day: PlannedDay): number {
  const all = [...(day.slots.lunch ?? []), ...(day.slots.dinner ?? [])];
  return all.reduce((s, r) => s + recipeSodium(r), 0) / 8;
}

export const SODIUM_LIMIT_MG = 2000;
