import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  GetMedicineLetterListResponse,
  GetMedicineLetterResponse,
  LetterStatus,
  Medicine,
  MedicineLetter,
  MedicineUseTime,
  PostMedicineLetterResponse,
  UpdateStatusMedicineLetterResponse
} from "../router/medicine/protocols";
import { sortAndUnique } from "../utils/arrayHelper";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import type { FileServiceInterface } from "../utils/FileService";
import NotiService, { NotificationTopics } from "./noti-service";

@injectable()
class MedicineService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private notiService: NotiService,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}
  private createMedicineLetterOnly = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    note: string
  ) => {
    const id = uuidv4();
    // console.log(id);

    return this.mysqlDB
      .insertInto("MedicineLetter")
      .values({
        id: id,
        note: note,
        status: "NotConfirmed",
        createdAt: new Date(),
        startDate: startDate,
        endDate: endDate,
        studentId: studentId,
        createdByParentId: parentId
      })
      .executeTakeFirstOrThrow()
      .then((_) => {
        void this.notiCreateLetter(studentId, id);
        return { id: id };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };

  private createMedicineOnly = async (
    medicineLetterId: string,
    medicines: z.infer<typeof Medicine>[]
  ) => {
    if (medicines.length == 0) return;

    void (await this.mysqlDB
      .insertInto("Medicine")
      .values(
        medicines.map((medicine) => {
          const getPhotoPath = (photo: string) => {
            if (photo === "") return "";
            const filename = "./medicine/" + uuidv4();
            this.fileService
              .asyncWriteFile(filename, medicine.photo)
              .catch((e: Error) => {
                console.log(e);
                throw SYSTEM_ERROR_MESSAGE;
              });
            return filename;
          };
          return {
            medicineLetterId: medicineLetterId,
            name: medicine.name,
            amount: medicine.amount,
            photo: getPhotoPath(medicine.photo),
            time: medicine.time
          };
        })
      )
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };

  private deleteMedicineLetter = async (medicineLetterId: string) => {
    void (await this.mysqlDB
      .deleteFrom("MedicineLetter")
      .where("id", "=", medicineLetterId)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        if (resp.numDeletedRows == BigInt(0)) throw Error("delete failed");
        return true;
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };
  createMedicineLetter = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    note: string,
    medicines: z.infer<typeof Medicine>[]
  ): Promise<z.infer<typeof PostMedicineLetterResponse>> => {
    const { id } = await this.createMedicineLetterOnly(
      parentId,
      studentId,
      startDate,
      endDate,
      note
    );

    await this.createMedicineOnly(id, medicines);

    return {
      medicineLetterId: id
    };
  };

  private deleteMedicineLetterUseDiary = async (medicineLetterId: string) => {
    void (await this.mysqlDB
      .deleteFrom("MedicineLetterUseDiary")
      .where("medicineLetterId", "=", medicineLetterId)
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };

  private createMedicineLetterUseDiary = async (
    medicineLetterId: string,
    useDiary: z.infer<typeof MedicineUseTime>[]
  ) => {
    if (useDiary.length == 0) return;
    void (await this.mysqlDB
      .insertInto("MedicineLetterUseDiary")
      .values(
        useDiary.map((medicine) => {
          return {
            medicineLetterId: medicineLetterId,
            status: medicine.status,
            date: medicine.date,
            note: medicine.note
          };
        })
      )
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      }));
  };

  updateMedicineLetter = async (
    teacherId: string,
    medicineLetterId: string,
    status?: z.infer<typeof LetterStatus>,
    useDiary?: z.infer<typeof MedicineUseTime>[]
  ): Promise<z.infer<typeof UpdateStatusMedicineLetterResponse>> => {
    if (useDiary) {
      await this.deleteMedicineLetterUseDiary(medicineLetterId).catch((_) => {
        console.log(
          `delete medicine use diary failed, medletid=${medicineLetterId}`
        );
      });
      await this.createMedicineLetterUseDiary(medicineLetterId, useDiary).catch(
        (_) => {
          console.log(`insert medicine use diary failed`);
        }
      );
    }

    if (status)
      await this.mysqlDB
        .updateTable("MedicineLetter")
        .set({
          status,
          updatedByTeacherId: teacherId
        })
        .where("id", "=", medicineLetterId)
        .executeTakeFirstOrThrow()
        .then((res) => {
          if (res.numUpdatedRows <= 0) throw Error("Update failed");
        })
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });

    void this.notiUpdateLetter(teacherId, medicineLetterId, status, useDiary);
    return {};
  };

  private getMedicineLetterListByStudent = async (
    studentId: string
  ): Promise<z.infer<typeof GetMedicineLetterListResponse>> => {
    return this.mysqlDB
      .selectFrom("MedicineLetter")
      .innerJoin("Student", "Student.id", "MedicineLetter.studentId")
      .select([
        "MedicineLetter.id as id",
        "startDate",
        "endDate",
        "note",
        "createdAt",
        "status",
        "Student.fullname as studentName"
      ])
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => {
        // console.log(resp);
        const res = z.array(MedicineLetter).safeParse(resp);
        if (!res.success) throw SYSTEM_ERROR_MESSAGE;
        return {
          medicineLetterList: res.data
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };

  private getMedicineLetterListByClassId = async (
    classId: string
  ): Promise<z.infer<typeof GetMedicineLetterListResponse>> => {
    return this.mysqlDB
      .selectFrom("Student")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
      .innerJoin("MedicineLetter", "MedicineLetter.studentId", "Student.id")
      .select([
        "MedicineLetter.id as id",
        "MedicineLetter.startDate as startDate",
        "MedicineLetter.endDate as endDate",
        "MedicineLetter.note as note",
        "MedicineLetter.createdAt as createdAt",
        "MedicineLetter.status as status",
        "Student.fullname as studentName"
      ])
      .where("Class.id", "=", classId)
      .execute()
      .then((resp) => {
        // console.log(resp);
        const res = z.array(MedicineLetter).safeParse(resp);
        if (!res.success) throw SYSTEM_ERROR_MESSAGE;
        return {
          medicineLetterList: res.data
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };

  getMedicineLetterList = async (
    studentId: string | undefined,
    classId: string | undefined
  ): Promise<z.infer<typeof GetMedicineLetterListResponse>> => {
    if (studentId) return this.getMedicineLetterListByStudent(studentId);
    if (classId) return this.getMedicineLetterListByClassId(classId);

    throw SYSTEM_ERROR_MESSAGE;
  };
  getMedicineLetter = async (
    medicineLetterId: string
  ): Promise<z.infer<typeof GetMedicineLetterResponse>> => {
    const resp = await this.mysqlDB
      .selectFrom("MedicineLetter")
      .leftJoin("Medicine", "Medicine.medicineLetterId", "MedicineLetter.id")
      .leftJoin(
        this.mysqlDB
          .selectFrom("User")
          .select(["id", "fullname"])
          .as("UserTeacher"),
        "UserTeacher.id",
        "MedicineLetter.updatedByTeacherId"
      )
      .leftJoin(
        this.mysqlDB
          .selectFrom("User")
          .select(["id", "fullname"])
          .as("UserParent"),
        "UserParent.id",
        "MedicineLetter.createdByParentId"
      )
      .select([
        "MedicineLetter.id as id",
        "MedicineLetter.startDate as startDate",
        "MedicineLetter.endDate as endDate",
        "MedicineLetter.note as note",
        "MedicineLetter.createdAt as createdAt",
        "MedicineLetter.status as status",
        "UserTeacher.fullname as updatedByTeacher",
        "UserParent.fullname as createdByParent",
        "Medicine.id as medicine_id",
        "Medicine.name as medicine_name",
        "Medicine.photo as medicine_photo",
        "Medicine.amount as medicine_amount",
        "Medicine.time as medicine_time"
      ])
      .where("MedicineLetter.id", "=", medicineLetterId)
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (resp.length == 0) throw SYSTEM_ERROR_MESSAGE;
    const res = MedicineLetter.safeParse(resp[0]);
    if (!res.success) throw SYSTEM_ERROR_MESSAGE;

    const medicineLetter = res.data;
    const getPhoto = async (photoPath: string) => {
      if (!photoPath || photoPath === "") return "";
      return await this.fileService
        .asyncReadFile(photoPath)
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    };

    medicineLetter.medicines = await Promise.all(
      resp
        .filter(
          (
            item
          ): item is Omit<typeof item, "medicine_id"> & {
            medicine_id: string;
          } => item.medicine_id !== null
        )
        .map(async (item) => ({
          id: item.medicine_id,
          name: item.medicine_name ?? "",
          photo: await getPhoto(item.medicine_photo ?? ""),
          amount: item.medicine_amount ?? "",
          time: item.medicine_time ?? 0,
          batchNumber: 0
        }))
    );

    const batchList = sortAndUnique(
      medicineLetter.medicines.map((item) => item.time)
    );
    const timeToBatchNumber = new Map<number, number>(
      batchList.map((item, index) => [item, index])
    );
    medicineLetter.medicines = medicineLetter.medicines.map((item) => ({
      ...item,
      batchNumber: timeToBatchNumber.get(item.time) ?? 0
    }));
    medicineLetter.batchList = batchList;

    // for use diary
    const { useDiary } = await this.getMedicineLetterUseDiary(medicineLetterId);
    medicineLetter.useDiary = useDiary;

    return {
      medicineLetter: medicineLetter
    };
  };

  private getMedicineLetterUseDiary = async (
    medicineLetterId: string
  ): Promise<{
    useDiary: z.infer<typeof MedicineUseTime>[];
  }> => {
    const resp = await this.mysqlDB
      .selectFrom("MedicineLetter")
      .innerJoin(
        "MedicineLetterUseDiary",
        "MedicineLetterUseDiary.medicineLetterId",
        "MedicineLetter.id"
      )
      .select([
        "MedicineLetterUseDiary.date as date",
        "MedicineLetterUseDiary.status as status",
        "MedicineLetterUseDiary.note as note"
      ])
      .where("MedicineLetter.id", "=", medicineLetterId)
      .orderBy("MedicineLetterUseDiary.date")
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    const res = z.array(MedicineUseTime).safeParse(resp);
    if (!res.success) throw SYSTEM_ERROR_MESSAGE;

    return {
      useDiary: res.data
    };
  };

  private notiCreateLetter = async (studentId: string, letterId: string) => {
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
        "Bạn có đơn dặn thuốc mới",
        `Phụ huynh của bé ${
          item.studentFullname ?? ""
        } vừa tạo đơn dặn thuốc mới.`,
        JSON.stringify({
          pathname: "teacher/medicine/letter-detail-screen",
          params: { id: letterId, studentName: item.studentFullname }
        }),
        "icons/medicine-icon.png",
        item.teacherId,
        NotificationTopics.MedicineLetter
      );
    });
  };

  private notiUpdateLetter = async (
    teacherId: string,
    letterId: string,
    status?: z.infer<typeof LetterStatus>,
    useDiary?: z.infer<typeof MedicineUseTime>[]
  ) => {
    const parentId = await this.mysqlDB
      .selectFrom("MedicineLetter")
      .innerJoin("Student", "Student.id", "MedicineLetter.studentId")
      .innerJoin("User as Parent", "Student.parentId", "Parent.id")
      .select(["Parent.id as parentId"])
      .where("MedicineLetter.id", "=", letterId)
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

    if (status) {
      const updateText =
        status === "Confirmed" ? "được xác nhận" : "bị từ chối";

      parentId &&
        void this.notiService.insertNoti(
          `Đơn dặn thuốc của bạn được phản hồi`,
          `Đơn dặn thuốc đã ${updateText} bởi giáo viên ${
            teacherFullname ?? ""
          }`,
          JSON.stringify({
            pathname: "parent/medicine/letter-detail-screen",
            params: { id: letterId }
          }),
          "icons/medicine-icon.png",
          parentId,
          NotificationTopics.MedicineLetter
        );
    }

    if (useDiary) {
      parentId &&
        void this.notiService.insertNoti(
          `Đơn dặn thuốc của bạn được phản hồi`,
          `Giáo viên ${teacherFullname ?? ""} vừa cập nhật nhật ký uống thuốc`,
          JSON.stringify({
            pathname: "parent/medicine/letter-detail-screen",
            params: { id: letterId }
          }),
          "icons/medicine-icon.png",
          parentId,
          NotificationTopics.MedicineLetter
        );
    }
  };
}

export default MedicineService;
