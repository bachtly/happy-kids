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
export { Student, GetStudentListResponse, GetStudentListRequest };
export { CheckInRequest, CheckInResponse };
export { CheckOutRequest, CheckOutResponse };

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

  checkinTeacherFullname: z.nullable(z.string()),
  checkoutTeacherFullname: z.nullable(z.string()),

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

const Student = z.object({
  id: z.string(),
  fullname: z.string(),
  avatarUrl: z.nullable(z.string()),
  className: z.nullable(z.string()),

  attendanceStatus: z.nullable(z.string()),
  attendanceCheckinNote: z.nullable(z.string())
});

const GetStudentListRequest = z.object({
  classId: z.string()
});

const GetStudentListResponse = z.object({
  students: z.array(Student),
  message: z.nullable(z.string())
});

const CheckInRequest = z.object({
  studentId: z.string(),
  status: z.string(),
  note: z.nullable(z.string()),
  time: z.date(),
  teacherId: z.string(),
  photoUrl: z.nullable(z.string())
});

const CheckInResponse = z.object({
  message: z.nullable(z.string())
});

const CheckOutRequest = z.object({
  studentId: z.string(),
  note: z.nullable(z.string()),
  time: z.date(),
  teacherId: z.string(),
  photoUrl: z.nullable(z.string()),
  pickerRelativeId: z.nullable(z.string())
});

const CheckOutResponse = z.object({
  message: z.nullable(z.string())
});
