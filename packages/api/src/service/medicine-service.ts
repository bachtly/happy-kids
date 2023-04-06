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
  MedicineUseTime,
  PostMedicineLetterResponse,
  ResponseStatus,
  UpdateStatusMedicineLetterResponse
} from "../router/medicine/protocols";
import { sortAndUnique } from "../utils/arrayHelper";
import { getErrorMessage } from "../utils/errorHelper";

import { asyncReadFile, asyncWriteFile } from "../utils/fileIO";

@injectable()
class MedicineService {
  constructor(private mysqlDB: Kysely<DB>) {}
  private createMedicineLetterOnly = async (
    parentId: string,
    studentId: string,
    startDate: Date,
    endDate: Date,
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

  private createMedicineOnly = async (
    medicineLetterId: string,
    medicines: z.infer<typeof Medicine>[]
  ): Promise<Error | null> => {
    if (medicines.length == 0) return null;
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
            photo: getPhotoPath(medicine.photo),
            time: medicine.time
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
    note: string,
    medicines: z.infer<typeof Medicine>[]
  ): Promise<z.infer<typeof PostMedicineLetterResponse>> => {
    const { id, err } = await this.createMedicineLetterOnly(
      parentId,
      studentId,
      startDate,
      endDate,
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

  private deleteMedicineLetterUseDiary = async (
    medicineLetterId: string
  ): Promise<boolean> => {
    return this.mysqlDB
      .deleteFrom("MedicineLetterUseDiary")
      .where("medicineLetterId", "=", medicineLetterId)
      .execute()
      .then((_) => {
        return true;
      })
      .catch((_) => {
        return false;
      });
  };

  private createMedicineLetterUseDiary = async (
    medicineLetterId: string,
    useDiary: z.infer<typeof MedicineUseTime>[]
  ): Promise<Error | null> => {
    if (useDiary.length == 0) return null;
    return this.mysqlDB
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
      .then((_) => {
        // console.log(res);
        return null;
      })
      .catch((err: Error) => {
        return err;
      });
  };

  updateMedicineLetter = async (
    teacherId: string,
    medicineLetterId: string,
    status: z.infer<typeof LetterStatus>,
    useDiary: z.infer<typeof MedicineUseTime>[]
  ): Promise<z.infer<typeof UpdateStatusMedicineLetterResponse>> => {
    try {
      const deleteSuccess = await this.deleteMedicineLetterUseDiary(
        medicineLetterId
      );
      if (!deleteSuccess)
        console.log(
          `delete medicine use diary failed, medletid=${medicineLetterId}`
        );
      const insertError = await this.createMedicineLetterUseDiary(
        medicineLetterId,
        useDiary
      );
      if (insertError)
        console.log(
          `insert medicine use diary failed, error=${insertError.message}`
        );
    } catch (e: unknown) {
      return {
        status: ResponseStatus.Enum.Fail,
        message: getErrorMessage(e)
      };
    }

    return this.mysqlDB
      .updateTable("MedicineLetter")
      .set({
        status,
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
      const { useDiary } = await this.getMedicineLetterUseDiary(
        medicineLetterId
      );
      medicineLetter.useDiary = useDiary;

      return {
        status: ResponseStatus.Enum.Success,
        message: "",
        medicineLetter: medicineLetter
      };
    } catch (e: unknown) {
      return {
        status: ResponseStatus.Enum.Fail,
        message: getErrorMessage(e)
      };
    }
  };

  private getMedicineLetterUseDiary = async (
    medicineLetterId: string
  ): Promise<{
    useDiary: z.infer<typeof MedicineUseTime>[];
    err: Error | null;
  }> => {
    try {
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
        .execute();

      const res = z.array(MedicineUseTime).safeParse(resp);
      if (!res.success) {
        return {
          useDiary: [],
          err: res.error
        };
      }
      return {
        useDiary: res.data,
        err: null
      };
    } catch (e: unknown) {
      return {
        useDiary: [],
        err: Error(getErrorMessage(e))
      };
    }
  };
}

export default MedicineService;
