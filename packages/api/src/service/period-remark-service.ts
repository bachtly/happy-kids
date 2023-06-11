import { inject, injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import moment from "moment";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import AccountService from "./account-service";

@injectable()
class PeriodRemarkService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private accountService: AccountService,
    @inject("FileService") private fileService: FileServiceInterface,
    @inject("PhotoService") private photoService: PhotoServiceInterface
  ) {}

  getPeriodRemarkList = async (studentId: string, classId: string) => {
    console.log(
      `getPeriodRemarkList receive request ${JSON.stringify({
        studentId: studentId
      })}`
    );

    const remarks = await Promise.all(
      await this.mysqlDB
        .selectFrom("PeriodRemark")
        .innerJoin("Student", "Student.id", "PeriodRemark.studentId")
        .innerJoin(
          "StudentClassRelationship",
          "Student.id",
          "StudentClassRelationship.studentId"
        )
        .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
        .leftJoin("SchoolTerm", "SchoolTerm.id", "PeriodRemark.schoolTermId")
        .innerJoin("User as Teacher", "PeriodRemark.teacherId", "Teacher.id")
        .select([
          "PeriodRemark.id",
          "PeriodRemark.period",
          "PeriodRemark.content",
          "PeriodRemark.startTime",
          "Teacher.fullname as teacherFullname",
          "Teacher.avatarUrl as teacherAvatarUrl"
        ])
        .where("Student.id", "=", studentId)
        .where("Class.id", "=", classId)
        .whereRef("Class.schoolYear", "=", "SchoolTerm.year")
        .execute()
        .then((resp) =>
          resp.flat().map(async (item) => ({
            ...item,
            teacherAvatar: item.teacherAvatarUrl
              ? await this.photoService.getPhotoFromPath(item.teacherAvatarUrl)
              : ""
          }))
        )
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );
    return {
      remarks: remarks
    };
  };

  getPeriodRemarkListFromClassId = async (time: Date, classId: string) => {
    console.log(
      `getPeriodRemarkListFromClassId receive request ${JSON.stringify({
        time: time,
        classId: classId
      })}`
    );

    const date = moment(moment(time).format("MM/DD/YYYY"), "MM/DD/YYYY");
    const startOfMonth = moment(date.toDate().setDate(1)).toDate();
    const endOfMonth = moment(date.toDate().setDate(1))
      .add(1, "month")
      .toDate();

    const remarkReturn = await Promise.all(
      await this.mysqlDB
        .selectFrom("Student")
        .innerJoin(
          "StudentClassRelationship",
          "Student.id",
          "StudentClassRelationship.studentId"
        )
        .leftJoin(
          this.mysqlDB
            .selectFrom("PeriodRemark")
            .selectAll()
            .where("endTime", "=", endOfMonth)
            .where("startTime", "=", startOfMonth)
            .as("PeriodRemark"),
          "PeriodRemark.studentId",
          "Student.id"
        )
        .select([
          "Student.fullname as studentFullname",
          "Student.avatarUrl",
          "Student.id as studentId",
          "PeriodRemark.id as id",
          "PeriodRemark.period",
          "PeriodRemark.content",
          "PeriodRemark.startTime",
          "PeriodRemark.teacherId as teacherId"
        ])
        .where("StudentClassRelationship.classId", "=", classId)
        .execute()
        .then((resp) =>
          resp.flat().map(async (item) => ({
            ...item,
            studentAvatar: item.avatarUrl
              ? await this.photoService.getPhotoFromPath(item.avatarUrl)
              : ""
          }))
        )
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );

    return {
      remarks: remarkReturn
    };
  };

  insertPeriodRemark = async (
    remarkId: string | null,
    period: "Week" | "Month" | "Quarter" | "Year",
    content: string,
    startTime: Date,
    endTime: Date,
    studentId: string,
    teacherId: string,
    classId: string
  ) => {
    console.log(
      `insertPeriodRemark receive request ${JSON.stringify({
        remarkId: remarkId,
        period: period,
        content: content,
        startTime: startTime,
        endTime: endTime,
        studentId: studentId,
        teacherId: teacherId
      })}`
    );

    if (content.trim() === "") throw "Vui lòng nhập nội dung nhận xét";

    if (remarkId) {
      await this.mysqlDB
        .updateTable("PeriodRemark")
        .set({
          content: content,
          teacherId: teacherId
        })
        .where("id", "=", remarkId)
        .execute()
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    } else {
      const schoolTermId = await this.accountService.getSchoolTermIdByClass(
        classId
      );
      const count = await this.mysqlDB
        .insertInto("PeriodRemark")
        .values({
          period: period,
          content: content,
          startTime: startTime,
          endTime: endTime,
          studentId: studentId,
          teacherId: teacherId,
          schoolTermId
        })
        .executeTakeFirstOrThrow()
        .then((res) => res.numInsertedOrUpdatedRows)
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });

      if (!count || count <= 0) throw SYSTEM_ERROR_MESSAGE;
    }

    return {};
  };
}

export default PeriodRemarkService;
