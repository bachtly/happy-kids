import { z } from "zod";

const DailyRemarkActivityEnum = z.enum([
  "Study",
  "Eat",
  "Sleep",
  "Wc",
  "Other"
]);

const DailyRemarkActivity = z.object({
  activity: z.nullable(DailyRemarkActivityEnum),
  content: z.nullable(z.string())
});

const DailyRemark = z.object({
  id: z.nullable(z.string()),
  date: z.nullable(z.date()),
  activities: z.array(DailyRemarkActivity),
  teacherFullname: z.nullable(z.string()),
  teacherAvatar: z.nullable(z.string()),
  studentId: z.nullable(z.string()),
  teacherId: z.nullable(z.string())
});

const GetDailyRemarkListRequest = z.object({
  timeStart: z.date(),
  timeEnd: z.date(),
  studentId: z.string()
});

const GetDailyRemarkListResponse = z.object({
  remarks: z.array(DailyRemark)
});

export { GetDailyRemarkListRequest, GetDailyRemarkListResponse };

const TeacherDailyRemark = z.object({
  id: z.nullable(z.string()),
  date: z.nullable(z.date()),
  activities: z.array(DailyRemarkActivity),
  studentFullname: z.nullable(z.string()),
  studentAvatar: z.nullable(z.string()),
  studentId: z.nullable(z.string()),
  teacherId: z.nullable(z.string())
});

const GetDailyRemarkListFromClassIdRequest = z.object({
  time: z.date(),
  classId: z.string()
});

const GetDailyRemarkListFromClassIdResponse = z.object({
  remarks: z.array(TeacherDailyRemark)
});

export {
  GetDailyRemarkListFromClassIdRequest,
  GetDailyRemarkListFromClassIdResponse
};

const InsertDailyRemarkActivityRequest = z.object({
  activity: z.enum(["Study", "Eat", "Sleep", "Wc", "Other"]),
  content: z.string(),
  remarkId: z.nullable(z.string()),
  date: z.nullable(z.date()),
  studentId: z.nullable(z.string())
});

const InsertDailyRemarkActivityResponse = z.object({});

export { InsertDailyRemarkActivityRequest, InsertDailyRemarkActivityResponse };
