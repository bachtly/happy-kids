import { z } from "zod";
import { SchoolModelZod } from "../../model/school";
import { ClassModelZod } from "../../model/class";

export const SchoolPrincipalInfoZod = z.object({
  emailAddress: z.string()
});

export type SchoolPrincipalInfo = z.infer<typeof SchoolPrincipalInfoZod>;

export const CreateSchoolParamsZod = z.object({
  schoolName: z.string(),
  schoolPrincipal: SchoolPrincipalInfoZod
});

export type SchoolModel = z.infer<typeof SchoolModelZod>;

export const SchoolDetailInfoZod = z.object({
  schoolId: z.string(),
  schoolName: z.string(),
  schoolAddress: z.string().nullable(),
  createdTime: z.date(),
  activeStudentCount: z.number().nonnegative(),
  grandTotalStudentCount: z.number().nonnegative(),
  activeClassCount: z.number().nonnegative(),
  grandTotalClassCount: z.number().nonnegative(),
  activeTeachersCount: z.number().nonnegative()
});

export type SchoolDetailInfo = z.infer<typeof SchoolDetailInfoZod>;

export const GetSchoolDetailParamsZod = z.object({
  schoolId: z.string()
});

export const EditSchoolInfoParamsZod = z.object({
  schoolId: z.string(),
  schoolName: z.string(),
  schoolAddress: z.string()
});

export const ClassInSchoolDisplayInfoZod = z.object({
  classBasicInfo: ClassModelZod,
  studentCnt: z.number().nonnegative(),
  employeeCnt: z.number().nonnegative()
});

export type ClassInSchoolDisplayInfo = z.infer<
  typeof ClassInSchoolDisplayInfoZod
>;

export const GetAllClassDisplayInfoInSchoolParamsZod = z.object({
  schoolId: z.string().nullable()
});

export const GetStudentsInSchoolOrClassParamsZod = z.object({
  schoolId: z.string().nullable(),
  classId: z.string().nullable()
});

export const GetTeachersInSchoolOrClassParamsZod = z.object({
  schoolId: z.string().nullable(),
  classId: z.string().nullable()
});
