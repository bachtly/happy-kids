import { inject, injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import moment from "moment";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";

@injectable()
class PeriodRemarkService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface
  ) {}

  getPeriodRemarkList = async (studentId: string) => {
    console.log(
      `getPeriodRemarkList receive request ${JSON.stringify({
        studentId: studentId
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

    const remarks = await Promise.all(
      await this.mysqlDB
        .selectFrom("PeriodRemark")
        .innerJoin("User as Teacher", "PeriodRemark.teacherId", "Teacher.id")
        .select([
          "PeriodRemark.id",
          "PeriodRemark.period",
          "PeriodRemark.content",
          "PeriodRemark.startTime",
          "Teacher.fullname as teacherFullname",
          "Teacher.avatarUrl as teacherAvatarUrl"
        ])
        .where("studentId", "=", studentId)
        .execute()
        .then((resp) =>
          resp.flat().map(async (item) => ({
            ...item,
            teacherAvatar: item.teacherAvatarUrl
              ? await getPhoto(item.teacherAvatarUrl)
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

    const getPhoto = async (photoPath: string) => {
      if (!photoPath || photoPath === "") return "";
      try {
        return await this.fileService.asyncReadFile(photoPath);
      } catch (_) {
        return "";
      }
    };

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
            studentAvatar: item.avatarUrl ? await getPhoto(item.avatarUrl) : ""
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
    period: "Week" | "Month" | "Quarter" | "Year",
    content: string,
    startTime: Date,
    endTime: Date,
    studentId: string,
    teacherId: string
  ) => {
    console.log(
      `insertPeriodRemark receive request ${JSON.stringify({
        period: period,
        content: content,
        startTime: startTime,
        endTime: endTime,
        studentId: studentId,
        teacherId: teacherId
      })}`
    );

    if (content.trim() === "") throw "Vui lòng nhập nội dung nhận xét";

    const count = await this.mysqlDB
      .insertInto("PeriodRemark")
      .values({
        period: period,
        content: content,
        startTime: startTime,
        endTime: endTime,
        studentId: studentId,
        teacherId: teacherId
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (!count || count <= 0) throw SYSTEM_ERROR_MESSAGE;

    return {};
  };
}

export default PeriodRemarkService;
