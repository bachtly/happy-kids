import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import { z } from "zod";
import { AccountInfo } from "../router/account/protocols";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import * as bcrypt from "bcryptjs";

@injectable()
class AccountService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("PhotoService") private photoService: PhotoServiceInterface
  ) {}

  getAccountInfo = async (userId: string) => {
    const res = await this.mysqlDB
      .selectFrom("User")
      .select(["fullname", "email", "phone", "birthdate", "avatarUrl"])
      .where("id", "=", userId)
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {
      res: {
        fullname: res.fullname ?? "",
        email: res.email ?? "",
        phone: res.phone ?? "",
        birthdate: res.birthdate,
        avatar: await this.photoService.getPhotoFromPath(res.avatarUrl ?? "")
      }
    };
  };

  updateAccountInfo = async (
    userId: string,
    accountInfo: z.infer<typeof AccountInfo>
  ) => {
    const res = await this.mysqlDB
      .updateTable("User")
      .set({
        fullname: accountInfo.fullname,
        email: accountInfo.email,
        phone: accountInfo.phone,
        birthdate: accountInfo.birthdate,
        avatarUrl: this.photoService.storePhoto(accountInfo.avatar, "./account")
      })
      .where("id", "=", userId)
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (res.numUpdatedRows >= BigInt(0))
      console.log("update account-info success");

    return {};
  };

  checkPassword = async (
    userId: string,
    password: string
  ): Promise<{ match: boolean }> => {
    const res = await this.mysqlDB
      .selectFrom("User")
      .select("password")
      .where("id", "=", userId)
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    const isMatch = await bcrypt.compare(password, res.password);

    return { match: isMatch };
  };

  updatePassword = async (userId: string, oldPass: string, newPass: string) => {
    const { match } = await this.checkPassword(userId, oldPass);
    if (!match) throw "Mật khẩu hiện tại không chính xác. Vui lòng thử lại.";
    const hashedPassword = await bcrypt.hash(newPass, 10);

    const res = await this.mysqlDB
      .updateTable("User")
      .set({ password: hashedPassword })
      .where("id", "=", userId)
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
    if (res.numUpdatedRows >= BigInt(0))
      console.log("update account-password success");

    return {};
  };
}

export default AccountService;
