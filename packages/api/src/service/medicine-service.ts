import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  GetMedicineLetterListResponse,
  GetMedicineLetterResponse,
  LetterStatus,
  Medicine,
  MedicineLetter,
  PostMedicineLetterResponse,
  ResponseStatus,
  UpdateStatusMedicineLetterResponse
} from "../router/medicine/protocols";

import { asyncReadFile, asyncWriteFile } from "../utils/fileIO";

@injectable()
class MedicineService {
  constructor(private mysqlDB: Kysely<DB>) {}
  private createMedicineLetterOnly = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    timeInDay: number,
    note: string
  ): Promise<{ id: string; err: Error | null }> => {
    const id = uuidv4();
    // console.log(id);

    return this.mysqlDB
      .insertInto("MedicineLetter")
      .values({
        id: id,
        note: note,
        status: "NotConfirmed",
        createdAt: new Date(),
        isUsed: 0,
        startDate: startDate,
        endDate: endDate,
        time: timeInDay,
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

  private createMedicineOnly = async (
    medicineLetterId: string,
    medicines: z.infer<typeof Medicine>[]
  ): Promise<Error | null> => {
    return this.mysqlDB
      .insertInto("Medicine")
      .values(
        medicines.map((medicine) => {
          const getPhotoPath = (photo: string) => {
            if (photo === "") return "";
            const filename = "./medicine/" + uuidv4();
            asyncWriteFile(filename, medicine.photo).catch((e: Error) =>
              console.log("failed to write image medicine, error", e.message)
            );
            return filename;
          };
          return {
            medicineLetterId: medicineLetterId,
            name: medicine.name,
            amount: medicine.amount,
            photo: getPhotoPath(medicine.photo)
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
  private deleteMedicineLetter = async (
    medicineLetterId: string
  ): Promise<boolean> => {
    return this.mysqlDB
      .deleteFrom("MedicineLetter")
      .where("id", "=", medicineLetterId)
      .executeTakeFirstOrThrow()
      .then((resp) => {
        if (resp.numDeletedRows == BigInt(0)) throw Error("delete failed");
        return true;
      })
      .catch((_) => {
        return false;
      });
  };
  createMedicineLetter = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
    timeInDay: number,
    note: string,
    medicines: z.infer<typeof Medicine>[]
  ): Promise<z.infer<typeof PostMedicineLetterResponse>> => {
    const { id, err } = await this.createMedicineLetterOnly(
      parentId,
      studentId,
      startDate,
      endDate,
      timeInDay,
      note
    );
    if (err) {
      return {
        status: ResponseStatus.enum.Fail,
        message: err.message,
        medicineLetterId: ""
      };
    }
    const err2 = await this.createMedicineOnly(id, medicines);
    if (err2) {
      // cleaning if possible
      if (!(await this.deleteMedicineLetter(id)))
        console.log("clean medicineletter failed");
      return {
        status: ResponseStatus.enum.Fail,
        message: err2.message,
        medicineLetterId: ""
      };
    }
    return {
      status: ResponseStatus.enum.Success,
      message: "create success",
      medicineLetterId: id
    };
  };
  updateMedicineLetter = async (
    teacherId: string,
    medicineLetterId: string,
    status: z.infer<typeof LetterStatus>,
    isUsed: number
  ): Promise<z.infer<typeof UpdateStatusMedicineLetterResponse>> => {
    return this.mysqlDB
      .updateTable("MedicineLetter")
      .set({
        status,
        isUsed,
        updatedByTeacherId: teacherId
      })
      .where("id", "=", medicineLetterId)
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
        "time",
        "note",
        "createdAt",
        "status",
        "isUsed",
        "Student.fullname as studentName"
      ])
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => {
        // console.log(resp);
        const res = z.array(MedicineLetter).safeParse(resp);
        if (!res.success) {
          return {
            status: ResponseStatus.enum.Fail,
            message: res.error.message,
            medicineLetterList: []
          };
        }
        return {
          status: ResponseStatus.Enum.Success,
          message: "",
          medicineLetterList: res.data
        };
      })
      .catch((e: Error) => {
        return {
          status: ResponseStatus.Enum.Fail,
          message: e.message,
          medicineLetterList: []
        };
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
        "MedicineLetter.time as time",
        "MedicineLetter.note as note",
        "MedicineLetter.createdAt as createdAt",
        "MedicineLetter.status as status",
        "MedicineLetter.isUsed as isUsed",
        "Student.fullname as studentName"
      ])
      .where("Class.id", "=", classId)
      .execute()
      .then((resp) => {
        // console.log(resp);
        const res = z.array(MedicineLetter).safeParse(resp);
        if (!res.success) {
          return {
            status: ResponseStatus.enum.Fail,
            message: res.error.message,
            medicineLetterList: []
          };
        }
        return {
          status: ResponseStatus.Enum.Success,
          message: "",
          medicineLetterList: res.data
        };
      })
      .catch((e: Error) => {
        return {
          status: ResponseStatus.Enum.Fail,
          message: e.message,
          medicineLetterList: []
        };
      });
  };
  getMedicineLetterList = async (
    studentId: string | undefined,
    classId: string | undefined
  ): Promise<z.infer<typeof GetMedicineLetterListResponse>> => {
    if (studentId) return this.getMedicineLetterListByStudent(studentId);
    if (classId) return this.getMedicineLetterListByClassId(classId);
    return {
      status: ResponseStatus.Enum.Fail,
      message: "both classId and studentId missing",
      medicineLetterList: []
    };
  };
  getMedicineLetter = async (
    medicineLetterId: string
  ): Promise<z.infer<typeof GetMedicineLetterResponse>> => {
    try {
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
          "MedicineLetter.time as time",
          "MedicineLetter.note as note",
          "MedicineLetter.createdAt as createdAt",
          "MedicineLetter.status as status",
          "MedicineLetter.isUsed as isUsed",
          "UserTeacher.fullname as updatedByTeacher",
          "UserParent.fullname as createdByParent",
          "Medicine.id as medicine_id",
          "Medicine.name as medicine_name",
          "Medicine.photo as medicine_photo",
          "Medicine.amount as medicine_amount"
        ])
        .where("MedicineLetter.id", "=", medicineLetterId)
        .execute();

      if (resp.length == 0) throw Error("LetterId not exist");
      const res = MedicineLetter.safeParse(resp[0]);
      if (!res.success) {
        return {
          status: ResponseStatus.enum.Fail,
          message: res.error.message
        };
      }
      const medicineLetter = res.data;
      const getPhoto = async (photoPath: string) => {
        if (!photoPath || photoPath === "") return "";
        try {
          return await asyncReadFile(photoPath);
        } catch (_) {
          return "";
        }
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
            amount: item.medicine_amount ?? ""
          }))
      );
      return {
        status: ResponseStatus.Enum.Success,
        message: "",
        medicineLetter: medicineLetter
      };
    } catch (e: unknown) {
      return {
        status: ResponseStatus.Enum.Fail,
        message: (e as Error).message
      };
    }
  };
}

export default MedicineService;
