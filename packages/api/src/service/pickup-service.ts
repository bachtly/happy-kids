import { injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { v4 as uuidv4 } from "uuid";
import { asyncReadFile, asyncWriteFile } from "../utils/fileIO";
import moment from "moment";

@injectable()
class PickupService {
  constructor(private mysqlDB: Kysely<DB>) {}

  getPickupList = async (timeStart: Date, timeEnd: Date, studentId: string) => {
    console.log(
      `getPickupList receive request ${JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd,
        studentId: studentId
      })}`
    );

    const pickups = await this.mysqlDB
      .selectFrom("PickupLetter")
      .leftJoin("Relative", "PickupLetter.pickerRelativeId", "Relative.id")
      .leftJoin("Student", "PickupLetter.studentId", "Student.id")
      .select([
        "PickupLetter.id as id",
        "status",
        "pickupTime as time",
        "Relative.fullname as pickerFullname",
        "Student.fullname as studentFullname"
      ])
      .where("pickupTime", ">=", timeStart)
      .where("pickupTime", "<=", timeEnd)
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => resp.flat());

    console.log(pickups);

    return {
      pickups: pickups,
      message: null
    };
  };

  getPickupDetail = async (id: string) => {
    console.log(
      `getPickupDetail receive request ${JSON.stringify({
        id: id
      })}`
    );

    const pickup = await this.mysqlDB
      .selectFrom("PickupLetter")
      .leftJoin(
        "User as Teacher",
        "PickupLetter.updatedByTeacherId",
        "Teacher.id"
      )
      .leftJoin("Relative", "PickupLetter.pickerRelativeId", "Relative.id")
      .select([
        "PickupLetter.id",
        "PickupLetter.note",
        "PickupLetter.pickupTime as time",
        "PickupLetter.status",
        "PickupLetter.createdAt",
        "Teacher.fullname as teacherFullname",
        "Relative.fullname as pickerFullname"
      ])
      .where("PickupLetter.id", "=", id)
      .executeTakeFirst();

    if (pickup == null) {
      return {
        pickup: null,
        message: "No record found"
      };
    }

    return {
      pickup: pickup,
      message: null
    };
  };

  getRelativeList = async (parentId: string) => {
    console.log(
      `getRelativeList receive request ${JSON.stringify({
        parentId: parentId
      })}`
    );

    const getPhoto = async (photoPath: string) => {
      if (!photoPath || photoPath === "") return "";
      try {
        return await asyncReadFile(photoPath);
      } catch (_) {
        return "";
      }
    };

    const relatives = await Promise.all(
      await this.mysqlDB
        .selectFrom("Relative")
        .select(["id", "fullname", "phone", "avatarUrl"])
        .where("parentId", "=", parentId)
        .execute()
        .then((resp) => {
          const rels = resp.flat().map(async (item) => {
            return {
              ...item,
              avatar: item.avatarUrl
                ? await getPhoto(item.avatarUrl).then((resp) => resp.toString())
                : ""
            };
          });
          return rels;
        })
    );

    console.log(relatives);

    return {
      relatives: relatives,
      message: null
    };
  };

  insertRelative = async (
    fullname: string,
    note: string,
    phone: string,
    avatarData: string,
    parentId: string
  ) => {
    console.log(
      `insertRelative receive request ${JSON.stringify({
        fullname: fullname,
        note: note,
        phone: phone,
        parentId: parentId
      })}`
    );

    const getPhotoPath = (photoB64: string) => {
      if (photoB64 === "") return "";
      const filename = "./leaveletter/" + uuidv4() + ".jpg";
      asyncWriteFile(filename, photoB64).catch((e: Error) =>
        console.log("failed to write image medicine, error", e.message)
      );
      return filename;
    };

    const count = await this.mysqlDB
      .insertInto("Relative")
      .values({
        fullname: fullname,
        note: note,
        phone: phone,
        avatarUrl: getPhotoPath(avatarData),
        parentId: parentId
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows);

    if (!count || count <= 0) return { message: "Insertion fail." };

    return {
      message: null
    };
  };

  insertPickupLetter = async (
    pickerId: string,
    time: Date,
    studentId: string,
    note: string
  ) => {
    console.log(
      `insertPickupLetter receive request ${JSON.stringify({
        pickerId: pickerId,
        time: time,
        studentId: studentId,
        note: note
      })}`
    );

    const count = await this.mysqlDB
      .insertInto("PickupLetter")
      .values({
        pickerRelativeId: pickerId,
        studentId: studentId,
        createdAt: moment(moment.now()).toDate(),
        pickupTime: time,
        note: note,
        status: "NotConfirmed"
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows);

    if (!count || count <= 0) return { message: "Insertion fail." };

    return {
      message: null
    };
  };

  getPickupListFromStudentIds = async (time: Date, classId: string) => {
    console.log(
      `getPickupListFromStudentIds receive request ${JSON.stringify({
        time: time,
        classId: classId
      })}`
    );

    const startOfDate = moment(moment(time).format("MM/DD/YYYY")).toDate();
    const endOfDate = moment(moment(time).format("MM/DD/YYYY"))
      .add(1, "day")
      .toDate();

    const pickups = await this.mysqlDB
      .selectFrom("PickupLetter")
      .leftJoin("Relative", "PickupLetter.pickerRelativeId", "Relative.id")
      .innerJoin("Student", "PickupLetter.studentId", "Student.id")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .select([
        "PickupLetter.id as id",
        "status",
        "pickupTime as time",
        "Relative.fullname as pickerFullname",
        "Student.fullname as studentFullname"
      ])
      .where("pickupTime", "<=", endOfDate)
      .where("pickupTime", ">=", startOfDate)
      .where("StudentClassRelationship.classId", "=", classId)
      .execute()
      .then((resp) => resp.flat());

    console.log(pickups);

    return {
      pickups: pickups,
      message: null
    };
  };

  confirmPickupLetter = async (id: string) => {
    console.log(
      `confirmPickupLetter receive request ${JSON.stringify({
        id: id
      })}`
    );

    const query = this.mysqlDB
      .updateTable("PickupLetter")
      .set({
        status: "Confirmed"
      })
      .where("id", ">=", id);

    const count = await query
      .executeTakeFirstOrThrow()
      .then((res) => res.numUpdatedRows);

    if (count && count <= 0) return { message: "Update fail." };

    return {
      message: null
    };
  };

  rejectPickupLetter = async (id: string) => {
    console.log(
      `rejectPickupLetter receive request ${JSON.stringify({
        id: id
      })}`
    );

    const query = this.mysqlDB
      .updateTable("PickupLetter")
      .set({
        status: "Rejected"
      })
      .where("id", ">=", id);

    const count = await query
      .executeTakeFirstOrThrow()
      .then((res) => res.numUpdatedRows);

    if (count && count <= 0) return { message: "Update fail." };

    return {
      message: null
    };
  };
}

export default PickupService;
