import { z } from "zod";
import { LetterStatus } from "../leaveletter/protocols";
import { PickupLetterStatus } from "../pickup/protocols";

const AttendanceStatus = z.enum([
  "AbsenseWithoutPermission",
  "AbsenseWithPermission",
  "CheckedIn",
  "CheckedOut",
  "NotCheckedIn"
]);

const GetAttendanceListRequest = z.object({
  timeStart: z.date(),
  timeEnd: z.date(),
  studentId: z.string()
});

const AttendanceItem = z.object({
  id: z.string(),
  date: z.nullable(z.date()),
  status: z.nullable(AttendanceStatus),
  checkinTime: z.nullable(z.date()),
  checkoutTime: z.nullable(z.date()),
  checkinNote: z.nullable(z.string()),
  checkoutNote: z.nullable(z.string())
});

const GetAttendanceListResponse = z.object({
  attendances: z.array(AttendanceItem)
});

export {
  AttendanceStatus,
  AttendanceItem,
  GetAttendanceListRequest,
  GetAttendanceListResponse
};
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
  status: z.nullable(AttendanceStatus),
  checkinTime: z.nullable(z.date()),
  checkoutTime: z.nullable(z.date()),
  checkinNote: z.nullable(z.string()),
  checkoutNote: z.nullable(z.string()),
  checkinPhotos: z.nullable(z.array(z.string())),
  checkoutPhotos: z.nullable(z.array(z.string())),

  checkinTeacherFullname: z.nullable(z.string()),
  checkoutTeacherFullname: z.nullable(z.string()),

  pickerRelativeFullname: z.nullable(z.string())
});

const GetAttendanceItemDetailResponse = z.object({
  attendance: z.nullable(AttendanceItemDetail)
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
  statistics: z.nullable(AttendanceStatistics)
});

const Student = z.object({
  id: z.string(),
  fullname: z.nullable(z.string()),
  avatar: z.nullable(z.string()),
  className: z.nullable(z.string()),

  attendanceStatus: z.nullable(AttendanceStatus),
  attendanceCheckinNote: z.nullable(z.string()),
  attendanceCheckoutNote: z.nullable(z.string()),

  checkinPhotos: z.nullable(z.array(z.string())),
  checkoutPhotos: z.nullable(z.array(z.string())),

  leaveletterId: z.nullable(z.string()),
  leaveletterStatus: z.nullable(LetterStatus),

  pickupLetterId: z.nullable(z.string()),
  pickupLetterStatus: z.nullable(PickupLetterStatus)
});

const GetStudentListRequest = z.object({
  classId: z.string(),
  date: z.date()
});

const GetStudentListResponse = z.object({
  students: z.array(Student)
});

const CheckInRequest = z.object({
  studentId: z.string(),
  status: AttendanceStatus,
  note: z.nullable(z.string()),
  teacherId: z.string(),
  photos: z.nullable(z.array(z.string()))
});

const CheckInResponse = z.object({});

const CheckOutRequest = z.object({
  studentId: z.string(),
  note: z.nullable(z.string()),
  time: z.date(),
  teacherId: z.string(),
  photos: z.nullable(z.array(z.string())),
  pickerRelativeId: z.nullable(z.string())
});

const CheckOutResponse = z.object({});
