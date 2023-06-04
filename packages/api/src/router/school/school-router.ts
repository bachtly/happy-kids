import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { classService, schoolService } from "../../service/common-services";
import {
  ClassInSchoolDisplayInfoZod,
  CreateSchoolParamsZod,
  EditSchoolInfoParamsZod,
  GetAllClassDisplayInfoInSchoolParamsZod,
  GetSchoolDetailParamsZod,
  GetStudentsInSchoolOrClassParamsZod,
  GetTeachersInSchoolOrClassParamsZod
} from "./protocols";
import { z } from "zod";
import { SchoolModelZod } from "../../model/school";
import {
  ClassAndItsStudentsInfoZod,
  TeacherAndClassesDisplayInfoZod
} from "../class/protocols";

export const schoolRouter = createTRPCRouter({
  createSchool: protectedProcedure
    .input(CreateSchoolParamsZod)
    .mutation(async ({ input }) => {
      return await schoolService.createSchool(
        input.schoolName,
        input.schoolPrincipal
      );
    }),
  getAllSchoolsInfo: protectedProcedure
    .output(z.array(SchoolModelZod))
    .query(async () => {
      return await schoolService.getAllSchoolsModels();
    }),
  getSchoolDetail: protectedProcedure
    .input(GetSchoolDetailParamsZod)
    .query(async ({ input }) => {
      return await schoolService.getSchoolDetail(input.schoolId);
    }),
  editSchoolInfo: protectedProcedure
    .input(EditSchoolInfoParamsZod)
    .mutation(async ({ input }) => {
      return await schoolService.editSchoolInfo(
        input.schoolId,
        input.schoolName,
        input.schoolAddress
      );
    }),
  getAllClassesInfoInSchool: protectedProcedure
    .input(GetAllClassDisplayInfoInSchoolParamsZod)
    .output(z.array(ClassInSchoolDisplayInfoZod))
    .query(async ({ input }) => {
      return await classService.getAllClassesDisplayInfoInSchool(
        input.schoolId
      );
    }),
  getStudentInfosInSchoolOrClass: protectedProcedure
    .input(GetStudentsInSchoolOrClassParamsZod)
    .output(z.array(ClassAndItsStudentsInfoZod))
    .query(async ({ input }) => {
      if (input.schoolId) {
        return await classService.getClassAndItsStudentInSchoolInfo(
          input.schoolId
        );
      } else if (input.classId) {
        return [
          await classService.getStudentsAndClassDisplayInfo(input.classId)
        ];
      } else {
        return [];
      }
    }),
  getTeachersDisplayInfoInSchoolOrClass: protectedProcedure
    .input(GetTeachersInSchoolOrClassParamsZod)
    .output(z.array(TeacherAndClassesDisplayInfoZod))
    .query(async ({ input }) => {
      if (input.schoolId) {
        return await classService.getTeachersDisplayInfoInSchool(
          input.schoolId
        );
      } else {
        return [];
      }
    })
});
