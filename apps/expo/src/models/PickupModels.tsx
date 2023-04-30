type PickupLetterStatus = "NotConfirmed" | "Confirmed" | "Rejected";

const STATUS_ENUM_TO_VERBOSE = new Map([
  ["NotConfirmed", "Chưa xác nhận"],
  ["Confirmed", "Đã xác nhận"],
  ["Rejected", "Từ chối"]
]);

interface PickupItemModel {
  id: string;
  status?: string | null;
  time?: Date | null;
  pickerFullname?: string | null;
  studentFullname?: string | null;
  note?: string | null;
  teacherFullname?: string | null;
  createdAt?: Date | null;
}

interface RelativeModel {
  id: string;
  fullname: string | null;
  phone: string | null;
  avatarUrl: string | null;
  avatar: string | null;
}

export type { PickupItemModel, PickupLetterStatus, RelativeModel };
export { STATUS_ENUM_TO_VERBOSE };
