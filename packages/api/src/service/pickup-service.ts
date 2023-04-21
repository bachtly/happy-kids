import { injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { FileService } from "../utils/FileService";
import NotiService from "./noti-service";

@injectable()
class PickupService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private fileService: FileService,
    private notiService: NotiService
  ) {}

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
        return await this.fileService.asyncReadFile(photoPath);
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
      const filename = "./leaveletter/" + uuidv4();
      this.fileService
        .asyncWriteFile(filename, photoB64)
        .catch((e: Error) =>
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

    const id = uuidv4();
    const count = await this.mysqlDB
      .insertInto("PickupLetter")
      .values({
        id: id,
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

    const pickupInfos = await this.mysqlDB
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
      .then((resp) => resp);

    pickupInfos.map((item) => {
      void this.notiService.insertNoti(
        "Bạn có đơn đón về mới",
        `Phụ huynh của bé ${
          item.studentFullname ?? ""
        } vừa tạo đơn đón về mới.`,
        JSON.stringify({
          pathname: "teacher/pickup/pickup-detail-screen",
          params: { id }
        }),
        "icons/pickup-icon.png",
        item.teacherId
      );
    });

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

  confirmPickupLetter = async (id: string, teacherId: string) => {
    console.log(
      `confirmPickupLetter receive request ${JSON.stringify({
        id: id,
        teacherId: teacherId
      })}`
    );

    const count = await this.mysqlDB
      .updateTable("PickupLetter")
      .set({
        status: "Confirmed",
        updatedByTeacherId: teacherId
      })
      .where("id", "=", id)
      .executeTakeFirstOrThrow()
      .then((res) => res.numUpdatedRows);

    if (count && count <= 0) return { message: "Update fail." };

    const parentId = await this.mysqlDB
      .selectFrom("PickupLetter")
      .innerJoin("Student", "Student.id", "PickupLetter.studentId")
      .innerJoin("User as Parent", "Student.parentId", "Parent.id")
      .select(["Parent.id as parentId"])
      .where("PickupLetter.id", "=", id)
      .executeTakeFirst()
      .then((resp) => resp?.parentId);

    const teacherFullname = await this.mysqlDB
      .selectFrom("User as Teacher")
      .select(["Teacher.fullname"])
      .where("Teacher.id", "=", teacherId)
      .executeTakeFirst()
      .then((resp) => resp?.fullname);

    parentId &&
      void this.notiService.insertNoti(
        "Đơn đón về của bạn đã được xác nhận",
        `Đơn đón về đã được xác nhận bởi giáo viên ${teacherFullname ?? ""}`,
        JSON.stringify({
          pathname: "parent/pickup/pickup-detail-screen",
          params: { id: id }
        }),
        "icons/pickup-icon.png",
        parentId
      );

    return {
      message: null
    };
  };

  rejectPickupLetter = async (id: string, teacherId: string) => {
    console.log(
      `rejectPickupLetter receive request ${JSON.stringify({
        id: id,
        teacherId: teacherId
      })}`
    );

    const query = this.mysqlDB
      .updateTable("PickupLetter")
      .set({
        status: "Rejected",
        updatedByTeacherId: teacherId
      })
      .where("id", ">=", id);

    const count = await query
      .executeTakeFirstOrThrow()
      .then((res) => res.numUpdatedRows);

    if (count && count <= 0) return { message: "Update fail." };

    const parentId = await this.mysqlDB
      .selectFrom("PickupLetter")
      .innerJoin("Student", "Student.id", "PickupLetter.studentId")
      .innerJoin("User as Parent", "Student.parentId", "Parent.id")
      .select(["Parent.id as parentId"])
      .where("PickupLetter.id", "=", id)
      .executeTakeFirst()
      .then((resp) => resp?.parentId);

    const teacherFullname = await this.mysqlDB
      .selectFrom("User as Teacher")
      .select(["Teacher.fullname"])
      .where("Teacher.id", "=", teacherId)
      .executeTakeFirst()
      .then((resp) => resp?.fullname);

    parentId &&
      void this.notiService.insertNoti(
        "Đơn đón về của bạn đã bị từ chối",
        `Đơn đón về đã bị từ chối bởi giáo viên ${teacherFullname ?? ""}`,
        JSON.stringify({
          pathname: "parent/pickup/pickup-detail-screen",
          params: { id: id }
        }),
        "icons/pickup-icon.png",
        parentId
      );

    return {
      message: null
    };
  };
}

export default PickupService;
