import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { EmployeeRole, UserInfo } from "../model/user";

@injectable()
class UserService {
  constructor(private mysqlDB: Kysely<DB>) {}

  getUserInfo = async (userId: string): Promise<UserInfo> => {
    return this.mysqlDB
      .selectFrom("User")
      .selectAll()
      .where("User.id", "=", userId)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        return {
          ...resp,
          isAdmin: resp.userGroup == "Admin"
        };
      });
  };

  getUserInfoFromEmail = (email: string): Promise<UserInfo | null> => {
    return this.mysqlDB
      .selectFrom("User")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        return {
          ...resp,
          isAdmin: resp.userGroup == "Admin"
        };
      })
      .catch((_) => null);
  };

  addUserToSchool = async (userId: string, schoolId: string): Promise<void> => {
    await this.mysqlDB
      .updateTable("User")
      .set({ schoolId: schoolId })
      .where("id", "=", userId)
      .execute()
      .then();
  };

  getUserInSchool = async (
    schoolId: string,
    employeeRole?: EmployeeRole
  ): Promise<UserInfo[]> => {
    let query = this.mysqlDB
      .selectFrom("User")
      .selectAll()
      .where("schoolId", "=", schoolId);

    if (employeeRole) {
      query = query.where("employeeRole", "=", employeeRole);
    }
    return await query.execute().then((resp) =>
      resp.map((item) => {
        return {
          ...item,
          isAdmin: item.userGroup == "Admin"
        };
      })
    );
  };

  getTeacherRoleInSchool = async (schoolId: string): Promise<UserInfo[]> => {
    return this.getUserInSchool(schoolId, "Teacher");
  };
}

export default UserService;
