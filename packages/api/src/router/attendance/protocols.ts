import { z } from "zod";

const GetAttendanceListRequest = z.object({
  timeStart: z.date(),
  timeEnd: z.date(),
  studentId: z.string()
});

const AttendanceItem = z.object({
  id: z.string(),
  date: z.nullable(z.date()),
  status: z.nullable(z.string()),
  checkinTime: z.nullable(z.date()),
  checkoutTime: z.nullable(z.date()),
  checkinNote: z.nullable(z.string()),
  checkoutNote: z.nullable(z.string())
});

const GetAttendanceListResponse = z.object({
  attendances: z.array(AttendanceItem),
  message: z.nullable(z.string())
});

export { AttendanceItem, GetAttendanceListRequest, GetAttendanceListResponse };
export {
  GetAttendanceItemDetailRequest,
  GetAttendanceItemDetailResponse,
  AttendanceItemDetail
};
export {
  GetAttendanceStatisticsRequest,
  GetAttendanceStatisticsResponse,
  AttendanceStatistics
};

const GetAttendanceItemDetailRequest = z.object({
  id: z.string()
});

const AttendanceItemDetail = z.object({
  id: z.string(),
  date: z.nullable(z.date()),
  status: z.nullable(z.string()),
  checkinTime: z.nullable(z.date()),
  checkoutTime: z.nullable(z.date()),
  checkinNote: z.nullable(z.string()),
  checkoutNote: z.nullable(z.string()),
  checkinPhotoUrl: z.nullable(z.string()),
  checkoutPhotoUrl: z.nullable(z.string()),

  teacherFullname: z.nullable(z.string()),

  pickerRelativeFullname: z.nullable(z.string())
});

const GetAttendanceItemDetailResponse = z.object({
  attendance: z.nullable(AttendanceItemDetail),
  message: z.nullable(z.string())
});

const GetAttendanceStatisticsRequest = z.object({
  timeStart: z.date(),
  timeEnd: z.date(),
  studentId: z.string()
});

const AttendanceStatistics = z.object({
  CheckedIn: z.number(),
  NotCheckedIn: z.number(),
  AbsenseWithPermission: z.number(),
  AbsenseWithoutPermission: z.number()
});

const GetAttendanceStatisticsResponse = z.object({
  statistics: z.nullable(AttendanceStatistics),
  message: z.nullable(z.string())
});
