import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import type { FileServiceInterface } from "../utils/FileService";
import { TRPCError } from "@trpc/server";
import type { NextApiRequest } from "next";

interface JwtContent {
  id: string;
}

@injectable()
class AuthService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}

  deserializeUser = async (req: NextApiRequest) => {
    let id: string;

    try {
      const accessToken = req.headers["authorization"] ?? "";
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
    return id;
  };
}

export default AuthService;
