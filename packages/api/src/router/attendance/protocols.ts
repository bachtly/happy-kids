import { z } from "zod";

const GetAttendanceListRequest = z.object({
  timeStart: z.date(),
  timeEnd: z.date(),
  studentId: z.string()
});

const AttendanceItem = z.object({
  date: z.nullable(z.date()),
  status: z.nullable(z.string()),
  checkinNote: z.nullable(z.string()),
  checkoutNote: z.nullable(z.string())
});

const GetAttendanceListResponse = z.object({
  attendances: z.array(AttendanceItem),
  message: z.nullable(z.string())
});

export { AttendanceItem, GetAttendanceListRequest, GetAttendanceListResponse };
