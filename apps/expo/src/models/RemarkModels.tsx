type DailyRemarkActivity = "Study" | "Eat" | "Sleep" | "Wc" | "Other";

const ACTIVITIES = ["Study", "Eat", "Sleep", "Wc", "Other"];

const ACTIVITIES_VERBOSE_MAP = new Map([
  ["Study", "Học"],
  ["Eat", "Ăn"],
  ["Sleep", "Ngủ"],
  ["Wc", "Vệ sinh"],
  ["Other", "Khác"]
]);

const VERBOSE_ACTIVITIES_MAP = new Map([
  ["Học", "Study"],
  ["Ăn", "Eat"],
  ["Ngủ", "Sleep"],
  ["Vệ sinh", "Wc"],
  ["Khác", "Other"]
]);

export type { DailyRemarkActivity };
export { ACTIVITIES, ACTIVITIES_VERBOSE_MAP, VERBOSE_ACTIVITIES_MAP };
