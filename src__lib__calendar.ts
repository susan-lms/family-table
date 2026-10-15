/** Small date helpers for the planner calendar. Dates are plain YYYY-MM-DD text, worked out in UTC so the time zone never shifts a day. */
export const addDays = (iso: string, n: number): string => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
/** Monday = 0 ... Sunday = 6 */
export const weekdayMon0 = (iso: string): number => (new Date(iso + "T00:00:00Z").getUTCDay() + 6) % 7;
export const monthOf = (iso: string): string => iso.slice(0, 7);
export const addMonths = (month: string, n: number): string => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
};
export const daysBetween = (a: string, b: string): number =>
  Math.round((new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000);

/** The 6 rows x 7 columns of a month, Monday first. Days outside the month are null. */
export function monthGrid(month: string): Array<string | null> {
  const first = month + "-01";
  const lead = weekdayMon0(first);
  const [y, m] = month.split("-").map(Number);
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: Array<string | null> = Array(lead).fill(null);
  for (let d = 1; d <= count; d++) cells.push(`${month}-${String(d).padStart(2, "0")}`);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export interface DateRange { from: string; to: string }
export const MAX_RANGE_DAYS = 31;

/** Two taps make a range (the earlier tap becomes the start). Long ranges are cut to 31 days. */
export function makeRange(a: string, b: string): DateRange {
  const [from, to] = a <= b ? [a, b] : [b, a];
  return daysBetween(from, to) + 1 > MAX_RANGE_DAYS ? { from, to: addDays(from, MAX_RANGE_DAYS - 1) } : { from, to };
}

/** Monday to Sunday of the week that holds this date. */
export const weekOf = (iso: string): DateRange => {
  const start = addDays(iso, -weekdayMon0(iso));
  return { from: start, to: addDays(start, 6) };
};
