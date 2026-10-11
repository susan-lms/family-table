# Family Table (prototype)

Family meal planner for 8 people. Low salt, low sugar, low oil by default.

**Status:** Phase 1 prototype. Sample data only (2 days, 4 full recipes).
Costs are placeholders, not real prices. Recipes are not yet taste-tested.

## Run it on your computer

1. Install Node.js (version 20 or newer) from https://nodejs.org
2. Open a terminal in this folder.
3. Run: `npm install`
4. Run: `npm run dev`
5. Open http://localhost:3000 in your browser.

To see the phone view on a computer: press F12 in Chrome, then click the phone icon.

## Check the rules

Run `npm test`. It checks the meal rules, the 14-day no-repeat rule and the shopping list.

## Folder guide

- `src/lib/rules.ts` — meal rules, 14-day rule, budget warning
- `src/lib/shopping.ts` — combines ingredients into one list
- `src/lib/sample-data.ts` — sample recipes (replace later)
- `src/app/` — the screens
- `.env.example` — copy to `.env.local` in Phase 2 (database). Never share real keys.
