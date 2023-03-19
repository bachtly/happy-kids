import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { z } from "zod";
import { injectable } from "tsyringe";
import { CheckEmailExistenceResp } from "../router/authentication/protocols";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

@injectable()
class SignupService {
  constructor(private mysqlDB: Kysely<DB>) {}

  checkEmailExistence = (
    email: string
  ): Promise<z.infer<typeof CheckEmailExistenceResp>> => {
    return this.mysqlDB
      .selectFrom("User")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst()
      .then((resp) => {
        return {
          isExisted: !!resp
        };
      });
  };

  signupUser = (email: string, password: string, fullName: string) => {
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
            password: hashedPassword
          })
          .executeTakeFirst()
      )
      .then((_) => {});
  };
}

export default SignupService;
