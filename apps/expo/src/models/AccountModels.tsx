import { Moment } from "moment";

interface AccountInfoModel {
  fullname: string;
  email: string;
  phone: string;
  birthdate: Moment | null;
  avatar: string;
}

export type { AccountInfoModel };

interface StudentMeta {
  studentId: string;
  studentName: string;
  avatar: string;
  classId: string;
  className: string;
}

interface Student {
  name: string | null;
  avatar: string | null;
  birthdate: Date | null;
  className: string;
  height: string | null;
  weight: string | null;
}

export type { StudentMeta, Student };
