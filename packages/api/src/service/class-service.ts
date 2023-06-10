import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import UserService from "./user-service";
import { showStringOrEmpty } from "../../../shared/string-utils";
import { ClassModel } from "../model/class";
import StudentService from "./student-service";
import {
  ClassAndItsStudentsInfo,
  TeacherAndClassesDisplayInfo
} from "../router/class/protocols";
import { StudentWithParentInfo } from "../router/student/protocols";
import { ClassInSchoolDisplayInfo } from "../router/school/protocols";

@injectable()
class ClassService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private userService: UserService,
    private studentService: StudentService
  ) {}

  getAssociatedClassesOfUser = (userId: string) => {
    return this.mysqlDB
      .selectFrom("Class")
      .innerJoin("TeacherClassRelationship as Rel", "Class.id", "Rel.classId")
      .select([
        "Class.id as classId",
        "Class.name as className",
        "Class.schoolYear as schoolYear"
      ])
      .where("Rel.teacherId", "=", userId)
      .execute()
      .then((resp) =>
        resp.map((classInfo) => ({
          classId: classInfo.classId,
          className: classInfo.className,
          schoolYear: classInfo.schoolYear
        }))
      );
  };

  getAllClassModelsInSchool = async (
    schoolId: string | null
  ): Promise<ClassModel[]> => {
    let query = this.mysqlDB.selectFrom("Class").selectAll();
    if (schoolId) {
      query = query.where("schoolId", "=", schoolId);
    }
    return query.orderBy("createdAt", "desc").execute();
  };

  getClassModel = async (classId: string): Promise<ClassModel> => {
    return this.mysqlDB
      .selectFrom("Class")
      .selectAll()
      .where("id", "=", classId)
      .executeTakeFirstOrThrow();
  };

  getStudentIdsInClasses = async (classIds: string[]): Promise<string[]> => {
    return classIds.length > 0
      ? await this.mysqlDB
          .selectFrom("StudentClassRelationship")
          .select("studentId")
          .distinct()
          .where("classId", "in", classIds)
          .execute()
          .then((resp) => resp.map((item) => item.studentId))
      : [];
  };

  getStudentsDisplayInfoInClass = async (
    classId: string
  ): Promise<StudentWithParentInfo[]> => {
    const studentIds = await this.getStudentIdsInClasses([classId]);
    return Promise.all(
      studentIds.map((studentId) => {
        return this.studentService.getStudentDisplayInfo(studentId);
      })
    );
  };

  getStudentsAndClassDisplayInfo = async (
    classId: string
  ): Promise<ClassAndItsStudentsInfo> => {
    const classModel = await this.getClassModel(classId);
    const students = await this.getStudentsDisplayInfoInClass(classId);
    return {
      students: students,
      classModel: classModel
    };
  };

  getEmployeeIdsInClasses = async (classIds: string[]): Promise<string[]> => {
    return classIds.length > 0
      ? await this.mysqlDB
          .selectFrom("TeacherClassRelationship")
          .select("teacherId")
          .where("classId", "in", classIds)
          .execute()
          .then((resp) => resp.map((item) => item.teacherId))
      : [];
  };

  getClassIdsOfTeacher = async (teacherId: string): Promise<string[]> => {
    return this.mysqlDB
      .selectFrom("TeacherClassRelationship")
      .select("classId")
      .where("teacherId", "=", teacherId)
      .execute()
      .then((resp) => resp.map((item) => item.classId));
  };

  verifyUserAndClassInSameSchool = (userId: string, classId: string) => {
    const userSchoolIdPromise = this.userService
      .getUserInfo(userId)
      .then((resp) => resp.schoolId);

    const classSchoolIdPromise = this.mysqlDB
      .selectFrom("Class")
      .select("Class.schoolId")
      .where("Class.id", "=", classId)
      .executeTakeFirst()
      .then((resp) => {
        if (!resp) {
          throw new Error(`classId ${classId} not found`);
        } else {
          return resp.schoolId;
        }
      });

    return Promise.all([userSchoolIdPromise, classSchoolIdPromise]).then(
      ([userSchoolId, classSchoolId]) => {
        if (!userSchoolId) {
          throw new Error(`User ${userId} does not belong to any school`);
        }
        if (!classSchoolId) {
          throw new Error(`Class ${classId} does not belong to any school`);
        }
        if (userSchoolId != classSchoolId) {
          throw new Error(
            `user ${userId} is in school ${showStringOrEmpty(
              userSchoolId
            )}, while class ${classId} is in school ${showStringOrEmpty(
              classSchoolId
            )}`
          );
        }
      }
    );
  };

  getClassAndItsStudentInSchoolInfo = async (
    schoolId: string
  ): Promise<ClassAndItsStudentsInfo[]> => {
    const classesInSchool = await this.getAllClassModelsInSchool(schoolId);
    return Promise.all(
      classesInSchool.map(async (classModel) => {
        return this.getStudentsDisplayInfoInClass(classModel.id).then(
          (studentInfos) => {
            return {
              students: studentInfos,
              classModel: classModel
            };
          }
        );
      })
    );
  };

  getAllClassesDisplayInfoInSchool = async (
    schoolId: string | null
  ): Promise<ClassInSchoolDisplayInfo[]> => {
    const classModels = await this.getAllClassModelsInSchool(schoolId);
    const allClassesAndSchoolsInfo = classModels.map(async (classModel) => {
      const studentCnt = await this.getStudentIdsInClasses([
        classModel.id
      ]).then((resp) => resp.length);
      const employeeCnt = await this.getEmployeeIdsInClasses([
        classModel.id
      ]).then((resp) => resp.length);
      return {
        classBasicInfo: classModel,
        studentCnt: studentCnt,
        employeeCnt: employeeCnt
      };
    });
    return Promise.all(allClassesAndSchoolsInfo);
  };

  addTeacherToClass = (teacherId: string, classId: string) => {
    return this.verifyUserAndClassInSameSchool(teacherId, classId).then((_) => {
      return this.mysqlDB
        .insertInto("TeacherClassRelationship")
        .values({
          teacherId,
          classId
        })
        .executeTakeFirst();
    });
  };

  getTeachersDisplayInfoInSchool = async (
    schoolId: string
  ): Promise<TeacherAndClassesDisplayInfo[]> => {
    const teachersInfoInSchool = await this.userService.getUserInSchool(
      schoolId
    );
    const classesModelInSchool = await this.getAllClassModelsInSchool(schoolId);
    const classesModelMap = new Map(
      classesModelInSchool.map((classModel) => [classModel.id, classModel])
    );
    const teachersAndClasses = teachersInfoInSchool.map(async (teacher) => {
      const classesIds = await this.getClassIdsOfTeacher(teacher.id);
      return {
        teacher: teacher,
        classes: classesIds
          .map((id) => classesModelMap.get(id))
          .filter((item) => item !== undefined) as ClassModel[]
      };
    });
    return Promise.all(teachersAndClasses);
  };
}

export default ClassService;
