import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { omit } from "lodash";
import { LetterStatus } from "../router/leaveletter/protocols";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import NotiService, { NotificationTopics } from "./noti-service";
import AccountService from "./account-service";

@injectable()
class LeaveLetterService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private notiService: NotiService,
    private accountService: AccountService,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}

  private createLeaveLetterOnly = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
    schoolTermId: string | null
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
        createdByParentId: parentId,
        schoolTermId
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
    if (photos.length == 0) return;

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
    classId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
    photos: string[]
  ) => {
    try {
      const schoolTermId = await this.accountService.getSchoolTermIdByClass(
        classId
      );
      const { id } = await this.createLeaveLetterOnly(
        parentId,
        studentId,
        startDate,
        endDate,
        reason,
        schoolTermId
      );

      await this.createLeaveLetterPhotoOnly(id, photos).catch(async (err) => {
        // cleaning if possible
        void (await this.deleteLeaveLetter(id).catch((_) =>
          console.log("clean leaveletter failed")
        ));
        throw err;
      });

      void this.notiForTeacher(
        studentId,
        id,
        "Bạn có đơn xin nghỉ mới",
        "Phụ huynh của bé $studentName vừa tạo đơn xin nghỉ mới."
      );

      return {
        leaveLetterId: id
      };
    } catch (err: unknown) {
      console.log(err);
      throw SYSTEM_ERROR_MESSAGE;
    }
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
        const updateText =
          status === "Confirmed" ? "được xác nhận" : "bị từ chối";
        void this.notiForParent(
          teacherId,
          leaveLetterId,
          `Đơn xin nghỉ của bạn được phản hồi`,
          `Đơn xin nghỉ ${updateText} bởi giáo viên $teacherName`
        );
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };

  private getLeaveLetterListByStudent = async (
    studentId: string,
    classId: string
  ) => {
    return this.mysqlDB
      .selectFrom("LeaveLetter")
      .innerJoin("Student", "Student.id", "LeaveLetter.studentId")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
      .leftJoin("SchoolTerm", "SchoolTerm.id", "LeaveLetter.schoolTermId")
      .select([
        "LeaveLetter.id as id",
        "LeaveLetter.startDate as startDate",
        "LeaveLetter.endDate as endDate",
        "LeaveLetter.reason as reason",
        "LeaveLetter.createdAt as createdAt",
        "LeaveLetter.status as status",
        "Student.fullname as studentName",
        "SchoolTerm.term as schoolTerm",
        "SchoolTerm.year as schoolYear",
        "SchoolTerm.id as schoolTermId"
      ])
      .where("Student.id", "=", studentId)
      .where("Class.id", "=", classId)
      .whereRef("Class.schoolYear", "=", "SchoolTerm.year")
      .execute()
      .then((resp) => {
        return {
          leaveLetterList: resp
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };
  private getLeaveLetterListByClassId = async (classId: string) => {
    return this.mysqlDB
      .selectFrom("Student")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
      .innerJoin("LeaveLetter", "LeaveLetter.studentId", "Student.id")
      .leftJoin("SchoolTerm", "SchoolTerm.id", "LeaveLetter.schoolTermId")
      .select([
        "LeaveLetter.id as id",
        "LeaveLetter.startDate as startDate",
        "LeaveLetter.endDate as endDate",
        "LeaveLetter.reason as reason",
        "LeaveLetter.createdAt as createdAt",
        "LeaveLetter.status as status",
        "Student.fullname as studentName",
        "SchoolTerm.term as schoolTerm",
        "SchoolTerm.year as schoolYear",
        "SchoolTerm.id as schoolTermId"
      ])
      .where("Class.id", "=", classId)
      .whereRef("Class.schoolYear", "=", "SchoolTerm.year")
      .execute()
      .then((resp) => {
        return {
          leaveLetterList: resp
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
  ) => {
    if (studentId && classId)
      return this.getLeaveLetterListByStudent(studentId, classId);
    if (classId) return this.getLeaveLetterListByClassId(classId);
    return {
      leaveLetterList: []
    };
  };

  getLeaveLetter = async (leaveLetterId: string) => {
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

    const leaveLetter: Omit<(typeof resp)[0], "letter_photo"> & {
      photos: string[];
    } = {
      ...omit(resp[0], ["letter_photo"]),
      photos: []
    };
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

  private notiForTeacher = async (
    studentId: string,
    letterId: string,
    title: string,
    message: string
  ) => {
    const letterInfo = await this.mysqlDB
      .selectFrom("User as Teacher")
      .innerJoin(
        "TeacherClassRelationship",
        "Teacher.id",
        "TeacherClassRelationship.teacherId"
      )
      .innerJoin(
        "StudentClassRelationship",
        "TeacherClassRelationship.classId",
        "StudentClassRelationship.classId"
      )
      .innerJoin("Student", "Student.id", "StudentClassRelationship.studentId")
      .select([
        "Student.fullname as studentFullname",
        "Teacher.id as teacherId"
      ])
      .where("Student.id", "=", studentId)
      .execute()
      .then((resp) => resp)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    letterInfo.map((item) => {
      void this.notiService.insertNoti(
        title,
        message.replaceAll("$studentName", item.studentFullname ?? ""),
        JSON.stringify({
          pathname: "teacher/leaveletter/letter-detail-screen",
          params: { id: letterId }
        }),
        "icons/leave-letter-icon.png",
        item.teacherId,
        NotificationTopics.LeaveLetter
      );
    });
  };

  private notiForParent = async (
    teacherId: string,
    letterId: string,
    title: string,
    message: string
  ) => {
    const parentId = await this.mysqlDB
      .selectFrom("LeaveLetter")
      .innerJoin("Student", "Student.id", "LeaveLetter.studentId")
      .innerJoin("User as Parent", "Student.parentId", "Parent.id")
      .select(["Parent.id as parentId"])
      .where("LeaveLetter.id", "=", letterId)
      .executeTakeFirst()
      .then((resp) => resp?.parentId);

    const teacherFullname = await this.mysqlDB
      .selectFrom("User as Teacher")
      .select(["Teacher.fullname"])
      .where("Teacher.id", "=", teacherId)
      .executeTakeFirst()
      .then((resp) => resp?.fullname)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    parentId &&
      void this.notiService.insertNoti(
        title,
        message.replaceAll("$teacherName", teacherFullname ?? ""),
        JSON.stringify({
          pathname: "parent/leaveletter/letter-detail-screen",
          params: { id: letterId }
        }),
        "icons/leave-letter-icon.png",
        parentId,
        NotificationTopics.LeaveLetter
      );
  };
}

export default LeaveLetterService;
