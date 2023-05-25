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
  leaveletterId?: string | null;
  leaveletterStatus?: LeaveLetterStatus | null;
  pickupLetterId?: string | null;
  pickupLetterStatus?: PickupLetterStatus | null;
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
