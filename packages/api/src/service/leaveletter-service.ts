import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  GetLeaveLetterListResponse,
  PostLeaveLetterResponse,
  LetterStatus,
  LeaveLetter,
  GetLeaveLetterResponse
} from "../router/leaveletter/protocols";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";

@injectable()
class LeaveLetterService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}
  private createLeaveLetterOnly = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    reason: string
  ) => {
    const id = uuidv4();
    return this.mysqlDB
      .insertInto("LeaveLetter")
      .values({
        id: id,
        reason: reason,
        status: "NotConfirmed",
        createdAt: new Date(),
        startDate: startDate,
        endDate: endDate,
        studentId: studentId,
        createdByParentId: parentId
      })
      .executeTakeFirstOrThrow()
      .then((_) => {
        return { id: id };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };

  private createLeaveLetterPhotoOnly = async (
    leaveLetterId: string,
    photos: string[]
  ) => {
    if (photos.length == 0) throw "Vui lòng tải lên hình ảnh";

    void (await this.mysqlDB
      .insertInto("LeaveLetterPhoto")
      .values(
        photos.map((photoB64) => {
          const getPhotoPath = (photoB64: string) => {
            if (photoB64 === "") return "";
            const filename = "./leaveletter/" + uuidv4();
            this.fileService
              .asyncWriteFile(filename, photoB64)
              .catch((e: Error) =>
                console.log("failed to write image medicine, error", e.message)
              );
            return filename;
          };
          return {
            leaveLetterId: leaveLetterId,
            photo: getPhotoPath(photoB64)
          };
        })
      )
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };
  private deleteLeaveLetter = async (leaveLetterId: string) => {
    void (await this.mysqlDB
      .deleteFrom("LeaveLetter")
      .where("id", "=", leaveLetterId)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        if (resp.numDeletedRows == BigInt(0))
          throw Error("Xóa đơn xin nghỉ thất bại");
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };
  createLeaveLetter = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
    photos: string[]
  ): Promise<z.infer<typeof PostLeaveLetterResponse>> => {
    const { id } = await this.createLeaveLetterOnly(
      parentId,
      studentId,
      startDate,
      endDate,
      reason
    );

    await this.createLeaveLetterPhotoOnly(id, photos);

    // cleaning if possible
    void (await this.deleteLeaveLetter(id).catch((_) =>
      console.log("clean leaveletter failed")
    ));

    return {
      leaveLetterId: id
    };
  };

  updateLeaveLetter = async (
    teacherId: string,
    leaveLetterId: string,
    status: z.infer<typeof LetterStatus>
  ) => {
    void (await this.mysqlDB
      .updateTable("LeaveLetter")
      .set({
        status,
        updatedByTeacherId: teacherId
      })
      .where("id", "=", leaveLetterId)
      .executeTakeFirstOrThrow()
      .then((res) => {
        if (res.numUpdatedRows <= 0) throw SYSTEM_ERROR_MESSAGE;
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };

  private getLeaveLetterListByStudent = async (
    studentId: string
  ): Promise<z.infer<typeof GetLeaveLetterListResponse>> => {
    return this.mysqlDB
      .selectFrom("LeaveLetter")
      .innerJoin("Student", "Student.id", "LeaveLetter.studentId")
      .select([
        "LeaveLetter.id as id",
        "startDate",
        "endDate",
        "reason",
        "createdAt",
        "status",
        "Student.fullname as studentName"
      ])
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => {
        const res = z.array(LeaveLetter).safeParse(resp);
        if (!res.success) throw SYSTEM_ERROR_MESSAGE;

        return {
          leaveLetterList: res.data
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };
  private getLeaveLetterListByClassId = async (
    classId: string
  ): Promise<z.infer<typeof GetLeaveLetterListResponse>> => {
    return this.mysqlDB
      .selectFrom("Student")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
      .innerJoin("LeaveLetter", "LeaveLetter.studentId", "Student.id")
      .select([
        "LeaveLetter.id as id",
        "LeaveLetter.startDate as startDate",
        "LeaveLetter.endDate as endDate",
        "LeaveLetter.reason as reason",
        "LeaveLetter.createdAt as createdAt",
        "LeaveLetter.status as status",
        "Student.fullname as studentName"
      ])
      .where("Class.id", "=", classId)
      .execute()
      .then((resp) => {
        // console.log(resp);
        const res = z.array(LeaveLetter).safeParse(resp);
        if (!res.success) throw SYSTEM_ERROR_MESSAGE;

        return {
          leaveLetterList: res.data
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };
  getLeaveLetterList = async (
    studentId: string | undefined,
    classId: string | undefined
  ): Promise<z.infer<typeof GetLeaveLetterListResponse>> => {
    if (studentId) return this.getLeaveLetterListByStudent(studentId);
    if (classId) return this.getLeaveLetterListByClassId(classId);
    return {
      leaveLetterList: []
    };
  };
  getLeaveLetter = async (
    leaveLetterId: string
  ): Promise<z.infer<typeof GetLeaveLetterResponse>> => {
    const resp = await this.mysqlDB
      .selectFrom("LeaveLetter")
      .leftJoin(
        "LeaveLetterPhoto",
        "LeaveLetterPhoto.leaveLetterId",
        "LeaveLetter.id"
      )
      .leftJoin(
        this.mysqlDB
          .selectFrom("User")
          .select(["id", "fullname"])
          .as("UserTeacher"),
        "UserTeacher.id",
        "LeaveLetter.updatedByTeacherId"
      )
      .leftJoin(
        this.mysqlDB
          .selectFrom("User")
          .select(["id", "fullname"])
          .as("UserParent"),
        "UserParent.id",
        "LeaveLetter.createdByParentId"
      )
      .select([
        "LeaveLetter.id as id",
        "LeaveLetter.startDate as startDate",
        "LeaveLetter.endDate as endDate",
        "LeaveLetter.reason as reason",
        "LeaveLetter.createdAt as createdAt",
        "LeaveLetter.status as status",
        "UserTeacher.fullname as updatedByTeacher",
        "UserParent.fullname as createdByParent",
        "LeaveLetterPhoto.photo as letter_photo"
      ])
      .where("LeaveLetter.id", "=", leaveLetterId)
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (resp.length == 0) throw SYSTEM_ERROR_MESSAGE;
    const res = LeaveLetter.safeParse(resp[0]);
    if (!res.success) throw SYSTEM_ERROR_MESSAGE;

    const leaveLetter = res.data;
    const getPhoto = async (photoPath: string) => {
      if (photoPath === "") return "";
      return await this.fileService
        .asyncReadFile(photoPath)
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    };

    leaveLetter.photos = await Promise.all(
      resp
        .filter(
          (
            item
          ): item is Omit<typeof item, "letter_photo"> & {
            letter_photo: string;
          } => item.letter_photo !== null
        )
        .map(async (item) => await getPhoto(item.letter_photo))
    );

    return {
      leaveLetter: leaveLetter
    };
  };
}

export default LeaveLetterService;
