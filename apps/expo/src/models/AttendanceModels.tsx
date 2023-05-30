import { LeaveLetterStatus } from "./LeaveLetterModels";
import { PickupLetterStatus } from "./PickupModels";

interface AttendanceItemModel {
  id: string;
  date: Date | null;
  status: string | null;
  checkinTime: Date | null;
  checkoutTime: Date | null;
  checkinNote: string | null;
  checkoutNote: string | null;
  checkinPhotos?: string[] | null;
  checkoutPhotos?: string[] | null;
  checkinTeacherFullname?: string | null;
  checkoutTeacherFullname?: string | null;
  pickerRelativeFullname?: string | null;
  studentFullname?: string | null;
  studentAvatar?: string | null;
  className?: string | null;
  thermo?: number | null;
}

interface AttendanceStatisticsModel {
  CheckedIn: number;
  NotCheckedIn: number;
  AbsenseWithPermission: number;
  AbsenseWithoutPermission: number;
}

interface AttendancePickupLetter {
  id: string |null;
  status: PickupLetterStatus|null;
}

interface AttendanceLeaveletter {
  id: string |null;
  status: LeaveLetterStatus | null;
}


interface AttendanceStudentModel {
  id: string | null;
  fullname: string | null;
  avatar: string | null;
  className?: string | null;
  attendanceStatus: string | null;
  attendanceCheckinNote: string | null;
  attendanceCheckoutNote: string | null;
  checkinPhotos?: string[] | null;
  checkoutPhotos?: string[] | null;
  leaveletters?: AttendanceLeaveletter[] | null;
  pickupLetters?: AttendancePickupLetter[] | null;
  thermo?: number | null;
  studentId?: string | null;
}

const STATUS_ENUM_TO_VERBOSE = new Map([
  ["CheckedOut", "Đã điểm danh"],
  ["NotCheckedIn", "Chưa điểm danh"],
  ["CheckedIn", "Đi học"],
  ["AbsenseWithPermission", "Vắng có phép"],
  ["AbsenseWithoutPermission", "Vắng không phép"]
]);

enum AttendanceStatus {
  CheckedOut = "CheckedOut",
  NotCheckedIn = "NotCheckedIn",
  CheckedIn = "CheckedIn",
  AbsenseWithPermission = "AbsenseWithPermission",
  AbsenseWithoutPermission = "AbsenseWithoutPermission"
}

export type {
  AttendanceItemModel,
  AttendanceStatisticsModel,
  AttendanceStudentModel
};

export { STATUS_ENUM_TO_VERBOSE, AttendanceStatus };
