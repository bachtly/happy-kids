import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import * as bcrypt from "bcryptjs";
import { Context } from "../trpc";
import jwt from "jsonwebtoken";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";

@injectable()
class LoginService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}
  loginUser = async (ctx: Context, email: string, password: string) => {
    console.log(`User ${email} is logging in`);

    const [isMatch, userGroup] = await this.mysqlDB
      .selectFrom("User")
      .select(["userGroup", "username", "password"])
      .where("username", "=", email)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        return bcrypt
          .compare(password, resp.password)
          .then((isMatch) => [isMatch, resp.userGroup]);
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    console.log(isMatch, userGroup);

    if (!isMatch) {
      return {
        success: false,
        accessToken: null,
        userId: null,
        classId: null,
        studentId: null,
        isTeacher: false
      };
    }

    if (userGroup == "Parent") {
      return await this.mysqlDB
        .selectFrom("User")
        .innerJoin("Student", "Student.parentId", "User.id")
        .innerJoin(
          "StudentClassRelationship",
          "StudentClassRelationship.studentId",
          "Student.id"
        )
        .select([
          "User.id as userId",
          "StudentClassRelationship.classId as classId",
          "Student.id as studentId"
        ])
        .where("username", "=", email)
        .executeTakeFirstOrThrow()
        .then(async (resp) => {
          const accessTokenPrivateKey = await this.fileService.asyncReadFile(
            process.env.JWT_ACCESS_PRIVATE_KEY_DIR as string
          );
          console.log(process.env.JWT_ACCESS_TOKEN_TTL);

          const accessToken = jwt.sign(
            { id: resp.userId },
            accessTokenPrivateKey,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_TTL, algorithm: "RS256" }
          );

          return {
            ...resp,
            success: true,
            accessToken: accessToken,
            isTeacher: false
          };
        })
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    } else if (userGroup == "Teacher") {
      return await this.mysqlDB
        .selectFrom("User")
        .innerJoin(
          "TeacherClassRelationship",
          "TeacherClassRelationship.teacherId",
          "User.id"
        )
        .select([
          "User.id as userId",
          "TeacherClassRelationship.classId as classId"
        ])
        .where("username", "=", email)
        .executeTakeFirstOrThrow()
        .then(async (resp) => {
          const accessTokenPrivateKey = await this.fileService.asyncReadFile(
            process.env.JWT_ACCESS_PRIVATE_KEY_DIR as string
          );
          console.log(process.env.JWT_ACCESS_TOKEN_TTL);

          const accessToken = jwt.sign(
            { id: resp.userId },
            accessTokenPrivateKey,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_TTL, algorithm: "RS256" }
          );

          return {
            ...resp,
            success: true,
            accessToken: accessToken,
            isTeacher: true
          };
        })
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    }
  };
}

export default LoginService;
