import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import { LoginResponse } from "../router/authentication/protocols";
import { UserGroup } from "../model/user";

@injectable()
class LoginService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}

  loginUser = async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    console.log(`User ${username} is logging in`);

    const [isMatch, userGroup, userId] = await this.mysqlDB
      .selectFrom("User")
      .select(["userGroup", "username", "password", "id"])
      .where("username", "=", username)
      .executeTakeFirstOrThrow()
      .then<[boolean, UserGroup, string]>((resp) => {
        return bcrypt
          .compare(password, resp.password)
          .then((isMatch) => [isMatch, resp.userGroup, resp.id]);
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
        isTeacher: false,
        userGroup: null
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
        .where("username", "=", username)
        .executeTakeFirstOrThrow()
        .then(async (resp) => {
          const accessTokenPrivateKey = await this.fileService.asyncReadFile(
            process.env.JWT_ACCESS_PRIVATE_KEY_DIR as string
          );
          const accessToken = jwt.sign(
            { id: resp.userId },
            accessTokenPrivateKey,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_TTL, algorithm: "RS256" }
          );

          return {
            userId: resp.userId,
            success: true,
            accessToken: accessToken,
            isTeacher: false,
            classId: resp.classId,
            studentId: resp.studentId,
            userGroup: userGroup
          };
        })
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    } else if (userGroup == "Employee") {
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
        .where("username", "=", username)
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
            userId: resp.userId,
            classId: resp.classId,
            success: true,
            accessToken: accessToken,
            isTeacher: true,
            studentId: null,
            userGroup: userGroup
          };
        })
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    } else if (userGroup == "Admin") {
      return {
        userId: userId,
        classId: null,
        isTeacher: false,
        studentId: null,
        accessToken: null,
        success: true,
        userGroup: userGroup
      };
    } else {
      return {
        userId: null,
        classId: null,
        isTeacher: false,
        studentId: null,
        accessToken: null,
        success: false,
        userGroup: null
      };
    }
  };
}

export default LoginService;
