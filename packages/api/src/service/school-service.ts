import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import {
  SchoolDetailInfo,
  SchoolModel,
  SchoolPrincipalInfo
} from "../router/school/protocols";
import UserService from "./user-service";
import { v4 as uuid } from "uuid";
import ClassService from "./class-service";
import StudentService from "./student-service";

@injectable()
class SchoolService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private userService: UserService,
    private classService: ClassService,
    private studentService: StudentService
  ) {}

  getSchoolModel = (schoolId: string): Promise<SchoolModel> => {
    return this.mysqlDB
      .selectFrom("School")
      .selectAll()
      .where("id", "=", schoolId)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        return {
          schoolId: resp.id,
          schoolName: resp.name,
          createdAt: resp.createdAt,
          schoolAddress: resp.address
        };
      });
  };

  getSchoolDetail = async (schoolId: string): Promise<SchoolDetailInfo> => {
    const [schoolName, schoolAddress, createdAt] = await this.mysqlDB
      .selectFrom("School")
      .select(["name", "address", "createdAt"])
      .where("id", "=", schoolId)
      .executeTakeFirstOrThrow()
      .then<[string, string | null, Date]>((resp) => {
        return [resp.name, resp.address, resp.createdAt];
      });

    const currentYear = new Date().getFullYear();

    const allClasses = await this.classService.getAllClassModelsInSchool(
      schoolId
    );

    const allClassIds = allClasses.map((aClass) => aClass.id);

    const classesThisYearIds = allClasses
      .filter((aClass) => aClass.schoolYear == currentYear)
      .map((aClass) => aClass.id);

    const allStudentsCnt = await this.classService
      .getStudentIdsInClasses(allClassIds)
      .then((resp) => resp.length);

    const studentsThisYearCnt = await this.classService
      .getStudentIdsInClasses(classesThisYearIds)
      .then((resp) => resp.length);

    const activeTeachersCnt = await this.userService
      .getUserInSchool(schoolId)
      .then((resp) => resp.length);

    return {
      schoolId: schoolId,
      schoolName: schoolName,
      schoolAddress: schoolAddress,
      createdTime: createdAt,
      activeStudentCount: studentsThisYearCnt,
      grandTotalStudentCount: allStudentsCnt,
      activeClassCount: classesThisYearIds.length,
      grandTotalClassCount: allClasses.length,
      activeTeachersCount: activeTeachersCnt
    };
  };

  createSchool = async (
    schoolName: string,
    principalInfo: SchoolPrincipalInfo
  ): Promise<void> => {
    const existingPrincipalInfo = await this.userService.getUserInfoFromEmail(
      principalInfo.emailAddress
    );
    if (!existingPrincipalInfo) {
      throw new Error(
        `Email ${principalInfo.emailAddress} does not exist in the system`
      );
    } else if (existingPrincipalInfo.schoolId) {
      throw new Error(
        `Email ${principalInfo.emailAddress} is already associated with school ${existingPrincipalInfo.schoolId}`
      );
    }
    const schoolId = uuid();
    await this.mysqlDB
      .insertInto("School")
      .values({
        id: schoolId,
        name: schoolName
      })
      .execute();
    await this.userService.addUserToSchool(existingPrincipalInfo.id, schoolId);
  };

  getAllSchoolsModels = (): Promise<SchoolModel[]> => {
    return this.mysqlDB
      .selectFrom("School")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute()
      .then((resp) => {
        return resp.map((school) => {
          return {
            schoolId: school.id,
            schoolAddress: school.address,
            schoolName: school.name,
            createdAt: school.createdAt
          };
        });
      });
  };

  editSchoolInfo = (
    schoolId: string,
    schoolName: string,
    schoolAddress: string
  ): Promise<void> => {
    return this.mysqlDB
      .updateTable("School")
      .set({ name: schoolName, address: schoolAddress })
      .where("id", "=", schoolId)
      .executeTakeFirstOrThrow()
      .then();
  };
}

export default SchoolService;
