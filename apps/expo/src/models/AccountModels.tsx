import { Moment } from "moment";

interface AccountInfoModel {
  fullname: string;
  email: string;
  phone: string;
  birthdate: Moment | null;
  avatar: string;
}

export type { AccountInfoModel };

interface ClassStudentMeta {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

interface SchoolStudentMeta {
  name: string;
  year: number | null;
  term: number | null;
}

interface StudentMeta {
  studentId: string;
  studentName: string;
  avatar: string;
  school: SchoolStudentMeta;
  classes: ClassStudentMeta[];
}

interface Student {
  name: string | null;
  avatar: string | null;
  birthdate: Date | null;
  height: string | null;
  weight: string | null;
}

export type { StudentMeta, Student, ClassStudentMeta, SchoolStudentMeta };
