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
      .selectAll()
      .where("username", "=", username)
      .where("password", "=", password)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        if (!resp) {
          return {
            status: LoginStatus.enum.Fail,
            message: "the username or password is wrong",
            userId: null
          };
        } else {
          return {
            status: LoginStatus.enum.Success,
            message: "login succeeded",
            userId: resp.id.toString("base64")
          };
        }
      })
      .catch((err: Error) => {
        return {
          status: LoginStatus.enum.Fail,
          message: err.message,
          userId: null
        };
      });
  };
}

export default LoginService;
