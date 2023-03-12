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
  teacherFullname: string | null;
  pickerRelativeFullname: string | null;
}

interface AttendanceStatisticsModel {
  CheckedIn: number;
  NotCheckedIn: number;
  AbsenseWithPermission: number;
  AbsenseWithoutPermission: number;
}

interface StudentModel {
  id: string;
  fullname: string;
  avatarUrl: string | null;
}

export { AttendanceItemModel, AttendanceStatisticsModel, StudentModel };
