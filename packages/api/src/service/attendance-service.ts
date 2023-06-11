import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";
import moment from "moment";
import { inject, injectable } from "tsyringe";
import { AttendanceStatus } from "../router/attendance/protocols";
import { z } from "zod";
import { PhotoService } from "../utils/PhotoService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import type { TimeServiceInterface } from "../utils/TimeService";
import { leaveletterService, pickupService } from "./common-services";
import AccountService from "./account-service";

@injectable()
class AttendanceService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private photoService: PhotoService,
    private accountService: AccountService,
    @inject("TimeService") private timeService: TimeServiceInterface
  ) {}

  getAttendanceList = async (
    timeStart: Date,
    timeEnd: Date,
    studentId: string,
    classId: string
  ) => {
    console.log(
      `getAttendanceListService receive request ${JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd,
        studentId: studentId,
        classId: classId
      })}`
    );

    const attendances = await Promise.all(
      await this.mysqlDB
        .selectFrom("Attendance")
        .leftJoin(
          "User as CheckinTeacher",
          "Attendance.checkinTeacherId",
          "CheckinTeacher.id"
        )
        .leftJoin(
          "User as CheckoutTeacher",
          "Attendance.checkoutTeacherId",
          "CheckoutTeacher.id"
        )
        .leftJoin(
          "User as Relative",
          "Attendance.pickerRelativeId",
          "Relative.id"
        )
        .innerJoin("Student", "Attendance.studentId", "Student.id")
        .innerJoin(
          "StudentClassRelationship",
          "StudentClassRelationship.studentId",
          "Student.id"
        )
        .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
        .leftJoin("SchoolTerm", "SchoolTerm.id", "Attendance.schoolTermId")
        .select([
          "Attendance.id",
          "Attendance.date",
          "Attendance.status",
          "Attendance.thermo as thermoStr",
          "Attendance.checkinTime",
          "Attendance.checkoutTime",
          "Attendance.checkinNote",
          "Attendance.checkoutNote",
          "Attendance.checkinPhotos",
          "Attendance.checkoutPhotos",
          "Student.fullname as studentFullname",
          "Student.avatarUrl as studentAvatarUrl",
          "CheckinTeacher.fullname as checkinTeacherFullname",
          "CheckoutTeacher.fullname as checkoutTeacherFullname",
          "Relative.fullname as pickerRelativeFullname",
          "Class.name as className"
        ])
        .where("date", ">=", this.timeService.getStartOfDay(timeStart))
        .where("date", "<=", this.timeService.getEndOfDay(timeEnd))
        .where("Student.id", "=", studentId)
        .where("Class.id", "=", classId)
        .whereRef("Class.schoolYear", "=", "SchoolTerm.year")
        .orderBy("date", "desc")
        .execute()
        .then((resp) =>
          resp.map(async (item) => {
            const checkinPhotoPaths = item.checkinPhotos
              ? <string[]>JSON.parse(item.checkinPhotos)
              : [];
            const checkoutPhotoPaths = item.checkoutPhotos
              ? <string[]>JSON.parse(item.checkoutPhotos)
              : [];

            const checkinPhotos = await Promise.all(
              checkinPhotoPaths.map((photoPath) =>
                this.photoService.getPhotoFromPath(photoPath)
              )
            );
            const checkoutPhotos = await Promise.all(
              checkoutPhotoPaths.map((photoPath) =>
                this.photoService.getPhotoFromPath(photoPath)
              )
            );
            const studentAvatar = await this.photoService.getPhotoFromPath(
              item.studentAvatarUrl ?? ""
            );

            return {
              ...item,
              checkinPhotos: checkinPhotos,
              checkoutPhotos: checkoutPhotos,
              studentAvatar: studentAvatar,
              thermo: Number(item.thermoStr)
            };
          })
        )
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );

    return {
      attendances: attendances
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
      .leftJoin(
        "User as CheckinTeacher",
        "Attendance.checkinTeacherId",
        "CheckinTeacher.id"
      )
      .leftJoin(
        "User as CheckoutTeacher",
        "Attendance.checkoutTeacherId",
        "CheckoutTeacher.id"
      )
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
        "Attendance.checkinPhotos",
        "Attendance.checkoutPhotos",
        "CheckinTeacher.fullname as checkinTeacherFullname",
        "CheckoutTeacher.fullname as checkoutTeacherFullname",
        "Relative.fullname as pickerRelativeFullname",
        "Attendance.thermo as thermoStr"
      ])
      .where("Attendance.id", "=", id)
      .executeTakeFirstOrThrow()
      .then(async (resp) => {
        const checkinPhotoPaths = resp.checkinPhotos
          ? <string[]>JSON.parse(resp.checkinPhotos)
          : [];
        const checkoutPhotoPaths = resp.checkoutPhotos
          ? <string[]>JSON.parse(resp.checkoutPhotos)
          : [];

        const checkinPhotos = await Promise.all(
          checkinPhotoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );
        const checkoutPhotos = await Promise.all(
          checkoutPhotoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );

        return {
          ...resp,
          checkinPhotos: checkinPhotos,
          checkoutPhotos: checkoutPhotos,
          thermo: Number(resp.thermoStr)
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {
      attendance: attendance
    };
  };

  getAttendanceStatistics = async (
    timeStart: Date,
    timeEnd: Date,
    studentId: string,
    classId: string
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
      .innerJoin("Student", "Student.id", "Attendance.studentId")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")

      .leftJoin("SchoolTerm", "SchoolTerm.id", "Attendance.schoolTermId")
      .select(["status", sql<number>`count(status)`.as("count")])
      .groupBy("status")
      .where("date", ">=", this.timeService.getStartOfDay(timeStart))
      .where("date", "<=", this.timeService.getEndOfDay(timeEnd))
      .where("Student.id", "=", studentId)
      .where("Class.id", "=", classId)
      .whereRef("Class.schoolYear", "=", "SchoolTerm.year")
      .execute()
      .then((resp) => resp.flat())
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    const statistics = {
      CheckedIn: 0,
      NotCheckedIn: 0,
      AbsenseWithPermission: 0,
      AbsenseWithoutPermission: 0
    };

    records.map((record) => {
      switch (record.status) {
        case "CheckedIn":
        case "CheckedOut":
          statistics.CheckedIn = record.count;
          break;
        case "NotCheckedIn":
          statistics.NotCheckedIn = record.count;
          break;
        case "AbsenseWithPermission":
          statistics.AbsenseWithPermission = record.count;
          break;
        case "AbsenseWithoutPermission":
          statistics.AbsenseWithoutPermission = record.count;
          break;
        default:
          console.log("The attendance status is not handled");
          throw SYSTEM_ERROR_MESSAGE;
      }
    });

    return {
      statistics: statistics
    };
  };

  getStudentList = async (classId: string, date: Date) => {
    console.log(
      `getStudentList receive request ${JSON.stringify({
        classId: classId,
        date: date
      })}`
    );

    const rawStudents = await Promise.all(
      await this.mysqlDB
        .selectFrom("Student")
        .innerJoin(
          "StudentClassRelationship",
          "Student.id",
          "StudentClassRelationship.studentId"
        )
        .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
        .leftJoin(
          this.mysqlDB
            .selectFrom("Attendance")
            .selectAll()
            .where("date", "<=", this.timeService.getEndOfDay(date))
            .where("date", ">=", this.timeService.getStartOfDay(date))
            .as("Attendance"),
          "Attendance.studentId",
          "Student.id"
        )
        .select([
          "Attendance.id",
          "Student.fullname",
          "Student.avatarUrl",
          "Class.name as className",
          "Attendance.thermo as thermoStr",
          "Attendance.status as attendanceStatus",
          "Attendance.checkinNote as attendanceCheckinNote",
          "Attendance.checkoutNote as attendanceCheckoutNote",
          "Attendance.checkinPhotos",
          "Attendance.checkoutPhotos",
          "Student.id as studentId"
        ])
        .where("Class.id", "=", classId)
        .execute()
        .then(
          async (resp) =>
            await Promise.all(
              resp.map(async (item) => {
                if (!item.attendanceStatus) {
                  item.attendanceStatus = "NotCheckedIn";
                }

                const leavelettersResp =
                  await leaveletterService.getLeaveLetterList(
                    item.studentId,
                    undefined
                  );
                const leaveletters = leavelettersResp.leaveLetterList.filter(
                  (letter) =>
                    this.timeService.getStartOfDay(letter.startDate) <= date &&
                    date <= this.timeService.getEndOfDay(letter.endDate)
                );

                const pickupLettersResp = await pickupService.getPickupList(
                  this.timeService.getStartOfDay(date),
                  this.timeService.getEndOfDay(date),
                  item.studentId
                );
                const pickupLetters = pickupLettersResp.pickups;

                const checkinPhotoPaths = item.checkinPhotos
                  ? <string[]>JSON.parse(item.checkinPhotos)
                  : [];
                const checkoutPhotoPaths = item.checkoutPhotos
                  ? <string[]>JSON.parse(item.checkoutPhotos)
                  : [];

                const checkinPhotos = await Promise.all(
                  checkinPhotoPaths.map((photoPath) =>
                    this.photoService.getPhotoFromPath(photoPath)
                  )
                );
                const checkoutPhotos = await Promise.all(
                  checkoutPhotoPaths.map((photoPath) =>
                    this.photoService.getPhotoFromPath(photoPath)
                  )
                );

                return {
                  ...item,
                  leaveletters: leaveletters,
                  pickupLetters: pickupLetters,
                  thermo: Number(item.thermoStr),
                  avatar: await this.photoService.getPhotoFromPath(
                    item.avatarUrl ?? ""
                  ),
                  checkinPhotos: checkinPhotos,
                  checkoutPhotos: checkoutPhotos
                };
              })
            )
        )
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );
    return {
      students: rawStudents
    };
  };

  checkin = async (
    studentId: string,
    classId: string,
    status: z.infer<typeof AttendanceStatus>,
    note: string,
    teacherId: string,
    photos: string[],
    thermo: number,
    date: Date
  ) => {
    console.log(
      `checkIn receive request ${JSON.stringify({
        status: status,
        checkInNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkInPhotos: photos,
        thermo: thermo,
        date: date
      })}`
    );

    if (studentId === "") throw SYSTEM_ERROR_MESSAGE;
    if (status == "NotCheckedIn") throw "Vui lòng chọn tình trạng điểm danh";
    if (status == "CheckedIn" && photos.length == 0)
      throw "Vui lòng tải lên hình ảnh điểm danh của bé";

    const attendanceId = await this.isAttendanceExist(studentId, classId, date);
    if (attendanceId) {
      await this.mysqlDB
        .updateTable("Attendance")
        .set({
          status: status,
          date: date,
          checkinTime: moment().toDate(),
          checkinNote: note,
          studentId: studentId,
          checkinTeacherId: teacherId,
          checkinPhotos: JSON.stringify(
            photos.map((photo) => {
              return this.photoService.storePhoto(photo, "./attendance");
            })
          ),
          thermo: thermo
        })
        .where("Attendance.id", "=", attendanceId)
        .executeTakeFirstOrThrow()
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });

      return {};
    }

    const schoolTermId = await this.accountService.getSchoolTermIdByClass(
      classId
    );
    await this.mysqlDB
      .insertInto("Attendance")
      .values({
        status: status,
        date: date,
        checkinTime: moment().toDate(),
        checkinNote: note,
        studentId: studentId,
        checkinTeacherId: teacherId,
        checkinPhotos: JSON.stringify(
          photos.map((photo) => {
            return this.photoService.storePhoto(photo, "./attendance");
          })
        ),
        thermo: thermo,
        schoolTermId
      })
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {};
  };

  isAttendanceExist = async (
    studentId: string,
    classId: string,
    date: Date
  ) => {
    return await this.mysqlDB
      .selectFrom("Attendance")
      .innerJoin("Student", "Student.id", "Attendance.studentId")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
      .leftJoin("SchoolTerm", "SchoolTerm.id", "Attendance.schoolTermId")
      .select(["Attendance.id"])
      .where("Student.id", "=", studentId)
      .where("Class.id", "=", classId)
      .whereRef("Class.schoolYear", "=", "SchoolTerm.year")
      .where("date", "<=", this.timeService.getEndOfDay(date))
      .where("date", ">=", this.timeService.getStartOfDay(date))
      .executeTakeFirst()
      .then((resp) => resp?.id)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };

  checkout = async (
    studentId: string,
    note: string,
    time: Date,
    teacherId: string,
    photos: string[],
    pickerRelativeId: string
  ) => {
    console.log(
      `checkOut receive request ${JSON.stringify({
        date: time,
        checkoutNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkoutPhotos: photos,
        pickerRelativeId: pickerRelativeId
      })}`
    );

    if (studentId === "") throw SYSTEM_ERROR_MESSAGE;
    if (photos.length == 0) throw "Vui lòng tải lên hình ảnh điểm danh của bé";

    await this.mysqlDB
      .updateTable("Attendance")
      .set({
        status: "CheckedOut",
        checkoutTime: moment().toDate(),
        checkoutNote: note,
        checkoutTeacherId: teacherId,
        checkoutPhotos: JSON.stringify(
          photos.map((photo) => {
            return this.photoService.storePhoto(photo, "./attendance");
          })
        ),
        pickerRelativeId: pickerRelativeId != "" ? pickerRelativeId : null
      })
      .where("studentId", "=", studentId)
      .where("date", "<=", this.timeService.getEndOfDay(time))
      .where("date", ">=", this.timeService.getStartOfDay(time))
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {};
  };
}

export default AttendanceService;
