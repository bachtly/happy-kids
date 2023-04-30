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
}

interface AttendanceStatisticsModel {
  CheckedIn: number;
  NotCheckedIn: number;
  AbsenseWithPermission: number;
  AbsenseWithoutPermission: number;
}

interface AttendanceStudentModel {
  id: string;
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
}

const STATUS_ENUM_TO_VERBOSE = new Map([
  ["CheckedOut", "Đã điểm danh"],
  ["NotCheckedIn", "Chưa điểm danh"],
  ["CheckedIn", "Đi học"],
  ["AbsenseWithPermission", "Có phép"],
  ["AbsenseWithoutPermission", "Không phép"]
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
