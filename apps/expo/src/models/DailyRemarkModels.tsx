interface DailyRemarkActivityModel {
  activity: "Study" | "Eat" | "Sleep" | "Wc" | "Other" | null;
  content: string | null;
}

interface DailyRemarkModel {
  id: string | null;
  date: Date | null;
  activities: DailyRemarkActivityModel[];
  teacherFullname?: string | null;
  teacherAvatar?: string | null;
  studentFullname?: string | null;
  studentAvatar?: string | null;
  studentId?: string | null;
  teacherId?: string | null;
}

const DAILY_REMARK_ACTIVITY_VERBOSE = new Map([
  ["Study", "Hoạt động học"],
  ["Eat", "Hoạt động ăn"],
  ["Sleep", "Hoạt động ngủ"],
  ["Wc", "Hoạt động vệ sinh"],
  ["Other", "Hoạt động khác"]
]);

export type { DailyRemarkModel };

export { DAILY_REMARK_ACTIVITY_VERBOSE };
