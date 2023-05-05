import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import { Context } from "../trpc";
// @ts-ignore
import jwt from "jsonwebtoken";
import type { FileServiceInterface } from "../utils/FileService";
import { TRPCError } from "@trpc/server";

@injectable()
class AuthService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}
  deserializeUser = async (ctx: Context) => {
    let id: string;

    try {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const accessToken: string = ctx.req.headers["authorization"];
      const accessTokenPublicKey = await this.fileService.asyncReadFile(
        process.env.JWT_ACCESS_PUBLIC_KEY_DIR as string
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      id = jwt.verify(accessToken, accessTokenPublicKey, {
        algorithms: ["RS256"]
      }).id as string;
    } catch {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại."
      });
    }

    if (!id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Đã xảy ra lỗi. Vui lòng đăng nhập lại."
      });

    ctx.user.userId = id;
  };
}

export default AuthService;
