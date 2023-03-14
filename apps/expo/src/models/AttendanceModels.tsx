interface AttendanceItemModel {
  id: string;
  date: Date | null;
  status: string | null;
  checkinTime: Date | null;
  checkoutTime: Date | null;
  checkinNote: string | null;
  checkoutNote: string | null;
  checkinPhotoUrl?: string | null;
  checkoutPhotoUrl?: string | null;
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
  fullname: string;
  avatarUrl: string | null;

  className?: string | null;

  attendanceStatus: string | null;
  attendanceCheckinNote: string | null;
}

export type {AttendanceItemModel, AttendanceStatisticsModel, AttendanceStudentModel};
