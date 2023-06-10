import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { CheckEmailExistenceResp } from "../router/authentication/protocols";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";
import UserService from "./user-service";

@injectable()
class SignupService {
  constructor(private mysqlDB: Kysely<DB>, private userService: UserService) {}

  checkEmailExistence = (email: string): Promise<CheckEmailExistenceResp> => {
    return this.userService.getUserInfoFromEmail(email).then((resp) => {
      if (resp) {
        return {
          isExisted: true
        };
      } else {
        return {
          isExisted: false
        };
      }
    });
  };

  signupUserExternalUser = (
    email: string,
    password: string,
    fullName: string
  ): Promise<void> => {
    const userId = uuidv4();
    return bcrypt
      .hash(password, 10)
      .then((hashedPassword) =>
        this.mysqlDB
          .insertInto("User")
          .values({
            username: email,
            id: userId,
            fullname: fullName,
            email: email,
            password: hashedPassword,
            userGroup: "Parent"
          })
          .executeTakeFirst()
      )
      .then();
  };
}

export default SignupService;
