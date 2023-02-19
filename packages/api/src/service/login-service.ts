import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { z } from "zod";
import { LoginResponse, LoginStatus } from "../router/authentication/protocols";

@injectable()
class LoginService {
  constructor(private mysqlDB: Kysely<DB>) {}
  loginUser = (
    username: string,
    password: string
  ): Promise<z.infer<typeof LoginResponse>> => {
    return this.mysqlDB
      .selectFrom("User")
      .select((eb) => eb.fn.count<number>("id").as("count"))
      .where("username", "=", username)
      .where("password", "=", password)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        if (!resp || resp.count == 0) {
          return {
            status: LoginStatus.enum.Fail,
            message: "the username or password is wrong"
          };
        } else {
          return {
            status: LoginStatus.enum.Success,
            message: "login succeeded"
          };
        }
      })
      .catch((err: Error) => {
        return {
          status: LoginStatus.enum.Fail,
          message: err.message
        };
      });
  };
}

export default LoginService;
