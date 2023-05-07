import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import { Context } from "../trpc";
import jwt from "jsonwebtoken";
import type { FileServiceInterface } from "../utils/FileService";
import { TRPCError } from "@trpc/server";

interface JwtContent {
  id: string;
}

@injectable()
class AuthService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}
  deserializeUser = async (ctx: Context) => {
    let id: string;

    try {
      const accessToken = ctx.req.headers["authorization"] ?? "";
      const accessTokenPublicKey = await this.fileService.asyncReadFile(
        process.env.JWT_ACCESS_PUBLIC_KEY_DIR as string
      );

      const content = jwt.verify(accessToken, accessTokenPublicKey, {
        algorithms: ["RS256"]
      }) as JwtContent;
      id = content.id;
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
