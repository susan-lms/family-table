import { festivalLibrary } from "./sample-data";
import type { Recipe } from "./types";

export interface Festival {
  id: string;
  name: string;
  name_zh: string;
  date: string; // YYYY-MM-DD
  blurb: string;
  dishIds: string[]; // 2 protein + 2 vegetable + 1 soup
  extra?: string; // idea that is not a planned dish
}

/** Dates checked on publicholidays.sg (Winter Solstice Tue 22 Dec 2026; Chinese New Year Sat 6 Feb 2027). Christmas and New Year's Eve are the usual dates. */
export const FESTIVALS: Festival[] = [
  {
    id: "dongzhi", name: "Dongzhi (Winter Solstice) dinner", name_zh: "冬至晚餐", date: "2026-12-22",
    blurb: "A warm family dinner: braised chicken, steamed fish, taro, greens and a rib soup.",
    dishIds: ["R-FS-101", "R-FS-102", "R-FS-103", "R-FS-104", "R-FS-105"],
    extra: "Traditional: a small bowl of tangyuan (glutinous rice balls) in light ginger water. Use little or no sugar, and cut each ball in half for the seniors so they do not choke.",
  },
  {
    id: "christmas", name: "Christmas dinner", name_zh: "圣诞晚餐", date: "2026-12-25",
    blurb: "Baked salmon, roast chicken thighs, roast vegetables and a creamy-style soup with no cream.",
    dishIds: ["R-FS-201", "R-FS-202", "R-FS-203", "R-FS-204", "R-FS-205"],
  },
  {
    id: "newyear", name: "New Year's Eve dinner", name_zh: "除夕（跨年）晚餐", date: "2026-12-31",
    blurb: "Prawns, fish with tofu, mushrooms, lotus root and a rib soup. Fish for 'abundance every year'.",
    dishIds: ["R-FS-301", "R-FS-302", "R-FS-303", "R-FS-304", "R-FS-305"],
  },
  {
    id: "cny", name: "Chinese New Year reunion dinner", name_zh: "团圆饭", date: "2027-02-05",
    blurb: "Poached chicken, steamed prawns, mushrooms with bok choy, peas and carrot, and a peanut rib soup.",
    dishIds: ["R-FS-401", "R-FS-402", "R-FS-403", "R-FS-404", "R-FS-405"],
    extra: "Yu sheng uses raw fish. Raw fish is not advised for the seniors, so leave the raw fish out and use extra vegetables.",
  },
];

export const festivalDishes = (f: Festival): Recipe[] =>
  f.dishIds.map((id) => festivalLibrary.find((r) => r.recipe_id === id)).filter((r): r is Recipe => !!r);
