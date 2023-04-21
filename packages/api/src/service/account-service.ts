import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { z } from "zod";
import { AccountInfo, UpdatePassError } from "../router/account/protocols";
import { getErrorMessage } from "../utils/errorHelper";
import { PhotoService } from "../utils/PhotoService";
import * as bcrypt from "bcryptjs";

@injectable()
class AccountService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private photoService: PhotoService
  ) {}

  getAccountInfo = async (
    userId: string
  ): Promise<{
    res: z.infer<typeof AccountInfo> | null;
    errMess: string;
  }> => {
    try {
      const res = await this.mysqlDB
        .selectFrom("User")
        .select(["fullname", "email", "phone", "birthdate", "avatarUrl"])
        .where("id", "=", userId)
        .executeTakeFirstOrThrow();
      return {
        res: {
          fullname: res.fullname ?? "",
          email: res.email ?? "",
          phone: res.phone ?? "",
          birthdate: res.birthdate,
          avatar: await this.photoService.getPhotoFromPath(res.avatarUrl ?? "")
        },
        errMess: ""
      };
    } catch (err: unknown) {
      return {
        res: null,
        errMess: getErrorMessage(err)
      };
    }
  };

  updateAccountInfo = async (
    userId: string,
    accountInfo: z.infer<typeof AccountInfo>
  ): Promise<{
    errMess: string;
  }> => {
    try {
      const res = await this.mysqlDB
        .updateTable("User")
        .set({
          fullname: accountInfo.fullname,
          email: accountInfo.email,
          phone: accountInfo.phone,
          birthdate: accountInfo.birthdate,
          avatarUrl: this.photoService.storePhoto(
            accountInfo.avatar,
            "./account"
          )
        })
        .where("id", "=", userId)
        .executeTakeFirstOrThrow();

      if (res.numUpdatedRows >= BigInt(0))
        console.log("update account-info success");

      return {
        errMess: ""
      };
    } catch (err: unknown) {
      return {
        errMess: getErrorMessage(err)
      };
    }
  };

  checkPassword = async (
    userId: string,
    password: string
  ): Promise<{ match: boolean; errMess: string }> => {
    try {
      const res = await this.mysqlDB
        .selectFrom("User")
        .select("password")
        .where("id", "=", userId)
        .executeTakeFirstOrThrow();
      const isMatch = await bcrypt.compare(password, res.password);
      return { match: isMatch, errMess: "" };
    } catch (err: unknown) {
      return { match: false, errMess: getErrorMessage(err) };
    }
  };

  updatePassword = async (
    userId: string,
    oldPass: string,
    newPass: string
  ): Promise<UpdatePassError> => {
    try {
      const { match, errMess } = await this.checkPassword(userId, oldPass);
      if (errMess) throw Error(errMess);
      if (!match) return "wrong_pass";
      const hashedPassword = await bcrypt.hash(newPass, 10);

      const res = await this.mysqlDB
        .updateTable("User")
        .set({ password: hashedPassword })
        .where("id", "=", userId)
        .executeTakeFirstOrThrow();
      if (res.numUpdatedRows >= BigInt(0))
        console.log("update account-password success");

      return "";
    } catch (err: unknown) {
      console.log(getErrorMessage(err));
      return "other";
    }
  };
}

export default AccountService;
