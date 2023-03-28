import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  GetLeaveLetterListResponse,
  PostLeaveLetterResponse,
  ResponseStatus,
  LetterStatus,
  UpdateStatusLeaveLetterResponse,
  LeaveLetter,
  GetLeaveLetterResponse
} from "../router/leaveletter/protocols";

import { asyncReadFile, asyncWriteFile } from "../utils/fileIO";

@injectable()
class LeaveLetterService {
  constructor(private mysqlDB: Kysely<DB>) {}
  private createLeaveLetterOnly = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    reason: string
  ): Promise<{ id: string; err: Error | null }> => {
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
        return { id: id, err: null };
      })
      .catch((err: Error) => {
        return { id: "", err: err };
      });
  };

  private createLeaveLetterPhotoOnly = async (
    leaveLetterId: string,
    photos: string[]
  ): Promise<Error | null> => {
    if (photos.length == 0) return null;
    return this.mysqlDB
      .insertInto("LeaveLetterPhoto")
      .values(
        photos.map((photoB64) => {
          const getPhotoPath = (photoB64: string) => {
            if (photoB64 === "") return "";
            const filename = "./leaveletter/" + uuidv4();
            asyncWriteFile(filename, photoB64).catch((e: Error) =>
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
      .then((_) => {
        // console.log(res);
        return null;
      })
      .catch((err: Error) => {
        return err;
      });
  };
  private deleteLeaveLetter = async (
    leaveLetterId: string
  ): Promise<boolean> => {
    return this.mysqlDB
      .deleteFrom("LeaveLetter")
      .where("id", "=", leaveLetterId)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        if (resp.numDeletedRows == BigInt(0)) throw Error("delete failed");
        return true;
      })
      .catch((_) => {
        return false;
      });
  };
  createLeaveLetter = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
    photos: string[]
  ): Promise<z.infer<typeof PostLeaveLetterResponse>> => {
    const { id, err } = await this.createLeaveLetterOnly(
      parentId,
      studentId,
      startDate,
      endDate,
      reason
    );
    if (err) {
      return {
        status: ResponseStatus.enum.Fail,
        message: err.message,
        leaveLetterId: ""
      };
    }
    const err2 = await this.createLeaveLetterPhotoOnly(id, photos);
    if (err2) {
      // cleaning if possible
      if (!(await this.deleteLeaveLetter(id)))
        console.log("clean leaveletter failed");
      else console.log("clean leaveletter success");

      return {
        status: ResponseStatus.enum.Fail,
        message: err2.message,
        leaveLetterId: ""
      };
    }
    return {
      status: ResponseStatus.enum.Success,
      message: "create success",
      leaveLetterId: id
    };
  };

  updateLeaveLetter = async (
    teacherId: string,
    leaveLetterId: string,
    status: z.infer<typeof LetterStatus>
  ): Promise<z.infer<typeof UpdateStatusLeaveLetterResponse>> => {
    return this.mysqlDB
      .updateTable("LeaveLetter")
      .set({
        status,
        updatedByTeacherId: teacherId
      })
      .where("id", "=", leaveLetterId)
      .executeTakeFirstOrThrow()
      .then((res) => {
        if (res.numUpdatedRows <= 0) throw Error("Update failed");
        return {
          status: ResponseStatus.enum.Success,
          message: "update success"
        };
      })
      .catch((err: Error) => {
        return {
          status: ResponseStatus.enum.Fail,
          message: err.message
        };
      });
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
        // console.log(resp);
        const res = z.array(LeaveLetter).safeParse(resp);
        if (!res.success) {
          return {
            status: ResponseStatus.enum.Fail,
            message: res.error.message,
            leaveLetterList: []
          };
        }
        return {
          status: ResponseStatus.Enum.Success,
          message: "",
          leaveLetterList: res.data
        };
      })
      .catch((e: Error) => {
        return {
          status: ResponseStatus.Enum.Fail,
          message: e.message,
          leaveLetterList: []
        };
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
        if (!res.success) {
          return {
            status: ResponseStatus.enum.Fail,
            message: res.error.message,
            leaveLetterList: []
          };
        }
        return {
          status: ResponseStatus.Enum.Success,
          message: "",
          leaveLetterList: res.data
        };
      })
      .catch((e: Error) => {
        return {
          status: ResponseStatus.Enum.Fail,
          message: e.message,
          leaveLetterList: []
        };
      });
  };
  getLeaveLetterList = async (
    studentId: string | undefined,
    classId: string | undefined
  ): Promise<z.infer<typeof GetLeaveLetterListResponse>> => {
    if (studentId) return this.getLeaveLetterListByStudent(studentId);
    if (classId) return this.getLeaveLetterListByClassId(classId);
    return {
      status: ResponseStatus.Enum.Fail,
      message: "both classId and studentId missing",
      leaveLetterList: []
    };
  };
  getLeaveLetter = async (
    leaveLetterId: string
  ): Promise<z.infer<typeof GetLeaveLetterResponse>> => {
    try {
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
        .execute();

      if (resp.length == 0) throw Error("LetterId not exist");
      const res = LeaveLetter.safeParse(resp[0]);
      if (!res.success) {
        return {
          status: ResponseStatus.enum.Fail,
          message: res.error.message,
          leaveLetter: null
        };
      }
      const leaveLetter = res.data;
      const getPhoto = async (photoPath: string) => {
        if (photoPath === "") return "";
        try {
          return await asyncReadFile(photoPath);
        } catch (_) {
          return "";
        }
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
        status: ResponseStatus.Enum.Success,
        message: "",
        leaveLetter: leaveLetter
      };
    } catch (e: unknown) {
      return {
        status: ResponseStatus.Enum.Fail,
        message: (e as Error).message,
        leaveLetter: null
      };
    }
  };
}

export default LeaveLetterService;
