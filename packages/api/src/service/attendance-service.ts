import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";

@injectable()
class AttendanceService {
  constructor(private mysqlDB: Kysely<DB>) {}

  getAttendanceList = async (
    timeStart: Date,
    timeEnd: Date,
    studentId: string
  ) => {
    console.log(
      `getAttendanceListService receive request ${JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd,
        studentId: studentId
      })}`
    );

    const attendances = await this.mysqlDB
      .selectFrom("Attendance")
      .select([
        "id",
        "date",
        "status",
        "checkinTime",
        "checkoutTime",
        "checkinNote",
        "checkoutNote"
      ])
      .where("date", ">=", timeStart)
      .where("date", "<=", timeEnd)
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => resp.flat());

    return {
      attendances: attendances,
      message: null
    };
  };

  getAttendanceItemDetail = async (id: string) => {
    console.log(
      `getAttendanceItemDetail receive request ${JSON.stringify({
        id: id
      })}`
    );

    const attendance = await this.mysqlDB
      .selectFrom("Attendance")
      .innerJoin("User as Teacher", "Attendance.teacherId", "Teacher.id")
      .leftJoin(
        "User as Relative",
        "Attendance.pickerRelativeId",
        "Relative.id"
      )
      .select([
        "Attendance.id",
        "Attendance.date",
        "Attendance.status",
        "Attendance.checkinTime",
        "Attendance.checkoutTime",
        "Attendance.checkinNote",
        "Attendance.checkoutNote",
        "Attendance.checkinPhotoUrl",
        "Attendance.checkoutPhotoUrl",
        "Teacher.fullname as teacherFullname",
        "Relative.fullname as pickerRelativeFullname"
      ])
      .where("Attendance.id", "=", id)
      .executeTakeFirst()
      .then((resp) => resp);

    if (attendance == null) {
      return {
        attendance: null,
        message: "No record found"
      };
    }

    return {
      attendance: attendance,
      message: null
    };
  };

  getAttendanceStatistics = async (
    timeStart: Date,
    timeEnd: Date,
    studentId: string
  ) => {
    console.log(
      `getAttendanceStatistics receive request ${JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd,
        studentId: studentId
      })}`
    );

    const records = await this.mysqlDB
      .selectFrom("Attendance")
      .select(["status", sql`count(status)`.as("count")])
      .groupBy("status")
      .where("date", ">=", timeStart)
      .where("date", "<=", timeEnd)
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => resp.flat());

    let statistics = {
      CheckedIn: 0,
      NotCheckedIn: 0,
      AbsenseWithPermission: 0,
      AbsenseWithoutPermission: 0
    };
    records.map((record) => {
      switch (record.status) {
        case "CheckedIn":
          statistics.CheckedIn = record.count as number;
          break;
        case "NotCheckedIn":
          statistics.NotCheckedIn = record.count as number;
          break;
        case "AbsenseWithPermission":
          statistics.AbsenseWithPermission = record.count as number;
          break;
        case "AbsenseWithoutPermission":
          statistics.AbsenseWithoutPermission = record.count as number;
          break;
        default:
          console.log("The attendance status is not handled");
      }
    });

    return {
      statistics: statistics,
      message: null
    };
  };

  getStudentList = async (classId: string) => {
    console.log(
      `getStudentList receive request ${JSON.stringify({
        classId: classId
      })}`
    );

    const students = await this.mysqlDB
      .selectFrom("Student")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .select(["Student.id", "Student.fullname", "Student.avatarUrl"])
      .where("StudentClassRelationship.classId", "=", classId)
      .execute()
      .then((resp) => resp.flat());

    return {
      students: students,
      message: null
    };
  };

  checkIn = async (
    studentId: string,
    status: string,
    note: string,
    time: Date,
    teacherId: string,
    photoUrl: string
  ) => {
    console.log(
      `checkIn receive request ${JSON.stringify({
        status: status,
        date: time,
        checkInTime: time,
        checkInNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkInPhotoUrl: photoUrl
      })}`
    );

    const count = await this.mysqlDB
      .insertInto("Attendance")
      .values({
        status: status,
        date: time,
        checkInTime: time,
        checkInNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkInPhotoUrl: photoUrl
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows);

    if (count && count <= 0) return { message: "Insertion fail." };

    return {
      message: null
    };
  };
}

export default AttendanceService;
