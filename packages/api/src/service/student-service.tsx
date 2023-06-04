import { injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { StudentModel } from "../model/student";
import { StudentWithParentInfo } from "../router/student/protocols";
import UserService from "./user-service";

@injectable()
class StudentService {
  constructor(private mysqlDB: Kysely<DB>, private userService: UserService) {}

  getStudentModel = (studentId: string): Promise<StudentModel> => {
    return this.mysqlDB
      .selectFrom("Student")
      .selectAll()
      .where("id", "=", studentId)
      .executeTakeFirstOrThrow();
  };

  getStudentDisplayInfo = async (
    studentId: string
  ): Promise<StudentWithParentInfo> => {
    const studentModel = await this.getStudentModel(studentId);
    const parentInfo = await this.userService.getUserInfo(
      studentModel.parentId
    );
    console.log(parentInfo);

    return {
      studentId: studentId,
      fullname: studentModel.fullname,
      birthdate: studentModel.birthdate,
      parentInfo: parentInfo
    };
  };
}

export default StudentService;
