import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  GetNoteThreadListResponse,
  GetNoteThreadResponse,
  NoteMessage,
  NoteThread,
  PostNoteThreadResponse,
  ResponseStatus,
  ThreadStatus
} from "../router/note/protocols";
import { getErrorMessage } from "../utils/errorHelper";
import { FileService } from "../utils/FileService";

@injectable()
class NoteService {
  constructor(private mysqlDB: Kysely<DB>, private fileService: FileService) {}

  insertNoteMessage = async (
    noteThreadId: string,
    message: z.infer<typeof NoteMessage>
  ): Promise<Error | null> => {
    try {
      const id = uuidv4();
      await this.mysqlDB
        .insertInto("NoteMessage")
        .values({
          id,
          noteThreadId,
          content: message.content,
          userId: message.userId,
          createdAt: new Date()
        })
        .execute();
      return null;
    } catch (error: unknown) {
      return Error(getErrorMessage(error));
    }
  };

  private deleteNoteThread = async (noteThreadId: string): Promise<boolean> => {
    return this.mysqlDB
      .deleteFrom("NoteThread")
      .where("id", "=", noteThreadId)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        if (resp.numDeletedRows == BigInt(0)) throw Error("delete failed");
        return true;
      })
      .catch((_) => {
        return false;
      });
  };

  createNoteThread = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    content: string,
    photos: string[]
  ): Promise<z.input<typeof PostNoteThreadResponse>> => {
    const id = uuidv4();
    const photoPaths = photos.map((photoB64) => {
      const getPhotoPath = (photoB64: string) => {
        if (photoB64 === "") return "";
        const filename = "./note/" + uuidv4();
        this.fileService
          .asyncWriteFile(filename, photoB64)
          .catch((e: Error) =>
            console.log("failed to write image note, error", e.message)
          );
        return filename;
      };
      return getPhotoPath(photoB64);
    });
    return this.mysqlDB
      .insertInto("NoteThread")
      .values({
        id: id,
        startDate,
        endDate,

        status: "NotConfirmed",
        content: content,
        photos: JSON.stringify({ photoPaths }),
        createdAt: new Date(),
        studentId: studentId,
        createdByParentId: parentId
      })
      .executeTakeFirstOrThrow()
      .then((_) => {
        return {
          status: ResponseStatus.enum.Success,
          message: "create success",
          noteThreadId: id
        };
      })
      .catch((err: Error) => {
        return {
          status: ResponseStatus.enum.Fail,
          message: err.message,
          noteThreadId: ""
        };
      });
  };

  private getNoteThreadListByStudent = async (
    studentId: string
  ): Promise<z.infer<typeof GetNoteThreadListResponse>> => {
    return this.mysqlDB
      .selectFrom("NoteThread")
      .innerJoin("Student", "Student.id", "NoteThread.studentId")
      .innerJoin("User", "User.id", "NoteThread.createdByParentId")
      .select([
        "NoteThread.id as id",
        "NoteThread.createdAt as createdAt",
        "startDate",
        "endDate",
        "status",
        "content",
        "User.fullname as createdByParent",

        "Student.fullname as studentName"
      ])
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => {
        // console.log(resp);

        const res = z.array(NoteThread).safeParse(resp);
        if (!res.success) {
          return {
            status: ResponseStatus.enum.Fail,
            message: res.error.message,
            noteThreadList: []
          };
        }
        return {
          status: ResponseStatus.Enum.Success,
          message: "",
          noteThreadList: res.data
        };
      })
      .catch((e: Error) => {
        return {
          status: ResponseStatus.Enum.Fail,
          message: e.message,
          noteThreadList: []
        };
      });
  };

  private getNoteThreadListByClass = async (
    classId: string
  ): Promise<z.infer<typeof GetNoteThreadListResponse>> => {
    return this.mysqlDB
      .selectFrom("Student")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
      .innerJoin("NoteThread", "NoteThread.studentId", "Student.id")
      .innerJoin("User", "User.id", "NoteThread.createdByParentId")
      .select([
        "NoteThread.id as id",
        "NoteThread.createdAt as createdAt",
        "startDate",
        "endDate",
        "status",
        "content",
        "User.fullname as createdByParent",

        "Student.fullname as studentName"
      ])
      .where("Class.id", "=", classId)
      .execute()
      .then((resp) => {
        // console.log(resp);

        const res = z.array(NoteThread).safeParse(resp);
        if (!res.success) {
          return {
            status: ResponseStatus.enum.Fail,
            message: res.error.message,
            noteThreadList: []
          };
        }
        return {
          status: ResponseStatus.Enum.Success,
          message: "",
          noteThreadList: res.data
        };
      })
      .catch((e: Error) => {
        return {
          status: ResponseStatus.Enum.Fail,
          message: e.message,
          noteThreadList: []
        };
      });
  };
  getNoteThreadList = async (
    studentId: string | undefined,
    classId: string | undefined
  ): Promise<z.infer<typeof GetNoteThreadListResponse>> => {
    if (studentId) return this.getNoteThreadListByStudent(studentId);
    if (classId) return this.getNoteThreadListByClass(classId);
    return {
      status: ResponseStatus.Enum.Fail,
      message: "both classId and studentId missing",
      noteThreadList: []
    };
  };

  getNoteThread = async (
    noteThreadId: string
  ): Promise<z.infer<typeof GetNoteThreadResponse>> => {
    try {
      const resp = await this.mysqlDB
        .selectFrom("NoteThread")
        .innerJoin("Student", "Student.id", "NoteThread.studentId")
        .leftJoin("NoteMessage", "NoteMessage.noteThreadId", "NoteThread.id")
        .leftJoin("User", "User.id", "NoteMessage.userId")
        .leftJoin(
          this.mysqlDB
            .selectFrom("User")
            .select(["id", "fullname"])
            .as("UserParent"),
          "UserParent.id",
          "NoteThread.createdByParentId"
        )
        .select([
          "NoteThread.id as id",
          "NoteThread.createdAt as createdAt",
          "startDate",
          "endDate",

          "photos",
          "NoteThread.status as status",
          "NoteThread.content as content",

          "NoteMessage.content as messContent",
          "NoteMessage.createdAt as messCreatedAt",
          "NoteMessage.id as messId",
          "NoteMessage.userId as messUserId",
          "User.fullname as messUser",

          "Student.fullname as studentName",
          "UserParent.fullname as createdByParent"
        ])
        .orderBy("NoteMessage.createdAt", "asc")
        .where("NoteThread.id", "=", noteThreadId)
        .execute();
      if (resp.length == 0)
        return {
          status: ResponseStatus.Enum.Fail,
          message: "not exist note thread",
          noteThread: null
        };
      const messages = resp
        .filter((item) => item.messId !== null)
        .map((item) => ({
          id: item.messId,
          content: item.messContent,
          createdAt: item.messCreatedAt,
          user: item.messUser,
          userId: item.messUserId
        }));

      const getPhoto = async (photoPath: string) => {
        if (photoPath === "") return "";
        try {
          return await this.fileService.asyncReadFile(photoPath);
        } catch (_) {
          return "";
        }
      };

      const getPhotos = async (): Promise<string[]> => {
        if (!resp[0].photos) return [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { photoPaths }: { photoPaths: string[] } = JSON.parse(
          resp[0].photos
        );

        return await Promise.all(
          photoPaths.map(async (item) => await getPhoto(item))
        );
      };

      const noteThread = {
        id: resp[0].id,
        createdAt: resp[0].createdAt,
        startDate: resp[0].startDate,
        endDate: resp[0].endDate,

        status: resp[0].status,
        content: resp[0].content,
        photos: await getPhotos(),

        messages: messages,
        studentName: resp[0].studentName,
        createdByParent: resp[0].createdByParent
      };
      const res = NoteThread.safeParse(noteThread);
      if (!res.success) {
        return {
          status: ResponseStatus.enum.Fail,
          message: res.error.message,
          noteThread: null
        };
      }
      return {
        status: ResponseStatus.Enum.Success,
        message: "",
        noteThread: res.data
      };
    } catch (err: unknown) {
      return {
        status: ResponseStatus.Enum.Fail,
        message: getErrorMessage(err),
        noteThread: null
      };
    }
  };

  updateNoteStatus = async (
    noteThreadId: string,
    status: z.infer<typeof ThreadStatus>
  ): Promise<Error | null> => {
    return this.mysqlDB
      .updateTable("NoteThread")
      .set({
        status
      })
      .where("id", "=", noteThreadId)
      .executeTakeFirstOrThrow()
      .then((res) => {
        if (res.numUpdatedRows <= 0) throw Error("Update failed");
        return null;
      })
      .catch((err: Error) => {
        return err;
      });
  };
}

export default NoteService;
