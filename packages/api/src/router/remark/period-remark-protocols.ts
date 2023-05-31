import { z } from "zod";

// const RemarkPeriod = z.enum(['Month'])

const PeriodRemark = z.object({
  id: z.string(),
  period: z.nullable(z.string()),
  content: z.nullable(z.string()),
  startTime: z.nullable(z.date()),
  teacherFullname: z.nullable(z.string()),
  teacherAvatar: z.nullable(z.string())
});

const GetPeriodRemarkListRequest = z.object({
  studentId: z.string()
});

const GetPeriodRemarkListResponse = z.object({
  remarks: z.array(PeriodRemark)
});

const TeacherPeriodRemark = z.object({
  id: z.nullable(z.string()),
  period: z.nullable(z.string()),
  content: z.nullable(z.string()),
  startTime: z.nullable(z.date()),
  studentFullname: z.nullable(z.string()),
  studentAvatar: z.nullable(z.string()),
  studentId: z.nullable(z.string())
});

const GetPeriodRemarkListFromClassIdRequest = z.object({
  time: z.date(),
  classId: z.string()
});

const GetPeriodRemarkListFromClassIdResponse = z.object({
  remarks: z.array(TeacherPeriodRemark)
});

export { GetPeriodRemarkListRequest, GetPeriodRemarkListResponse };

export {
  GetPeriodRemarkListFromClassIdRequest,
  GetPeriodRemarkListFromClassIdResponse
};

const InsertPeriodRemarkRequest = z.object({
  period: z.enum(["Week", "Month", "Quarter", "Year"]),
  content: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  studentId: z.string(),
  id: z.nullable(z.string())
});

const InsertPeriodRemarkResponse = z.object({});

export { InsertPeriodRemarkRequest, InsertPeriodRemarkResponse };
