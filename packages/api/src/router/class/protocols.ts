import { z } from "zod";
import { ClassModelZod } from "../../model/class";
import { StudentDisplayInfoZod } from "../student/protocols";
import { UserInfoZod } from "../../model/user";

export const ClassAndItsStudentsInfoZod = z.object({
  students: z.array(StudentDisplayInfoZod),
  classModel: ClassModelZod
});

export type ClassAndItsStudentsInfo = z.infer<
  typeof ClassAndItsStudentsInfoZod
>;

export const TeacherAndClassesDisplayInfoZod = z.object({
  teacher: UserInfoZod,
  classes: z.array(ClassModelZod)
});

export type TeacherAndClassesDisplayInfo = z.infer<
  typeof TeacherAndClassesDisplayInfoZod
>;
