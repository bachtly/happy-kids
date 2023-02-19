import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import LoginService from "./login-service";

@injectable()
class SignupService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private loginService: LoginService
  ) {}
  signUpUser = async (
    fullname: string,
    username: string,
    password: string,
    emailAddr: string
  ) => {
    const today = new Date();

    await this.mysqlDB
      ?.insertInto("User")
      .values({
        fullname: fullname,
        username: username,
        password: password,
        email: emailAddr,
        birthdate: today
      })
      .execute();
  };
}
export default SignupService;
