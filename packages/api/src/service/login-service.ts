import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { z } from "zod";
import { LoginResponse, LoginStatus } from "../router/authentication/protocols";
import * as bcrypt from "bcrypt";

@injectable()
class LoginService {
  constructor(private mysqlDB: Kysely<DB>) {}

  loginUser = (
    email: string,
    password: string
  ): Promise<z.infer<typeof LoginResponse>> => {
    console.log(`User ${email} is logging in`);
    return this.mysqlDB
      .selectFrom("User")
      .selectAll()
      .where("username", "=", email)
      .executeTakeFirst()
      .then<[boolean, null | string]>((resp) => {
        if (!resp) {
          return Promise.resolve([false, null]);
        } else {
          return bcrypt
            .compare(password, resp.password)
            .then((isMatch) => [isMatch, resp.id]);
        }
      })
      .then((resp) => {
        return {
          status: resp[0] ? LoginStatus.enum.Success : LoginStatus.enum.Fail,
          userId: resp[1]
        };
      })
      .catch((err: Error) => {
        console.log(err.message);
        return {
          status: LoginStatus.enum.Fail,
          userId: null
        };
      });
  };
}

export default LoginService;
