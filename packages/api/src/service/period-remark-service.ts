import { injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { asyncReadFile } from "../utils/fileIO";
import moment from "moment";

@injectable()
class PeriodRemarkService {
  constructor(private mysqlDB: Kysely<DB>) {}

  getPeriodRemarkList = async (studentId: string) => {
    console.log(
      `getPeriodRemarkList receive request ${JSON.stringify({
        studentId: studentId
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
    );
    return {
      remarks: remarks,
      message: null
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
        return await asyncReadFile(photoPath);
      } catch (_) {
        return "";
      }
    };

    const date = moment(moment(time).format("MM/DD/YYYY"), "MM/DD/YYYY");
    const startOfMonth = moment(date.toDate().setDate(1)).toDate();
    const endOfMonth = moment(date.toDate().setDate(1))
      .add(1, "month")
      .toDate();
    console.log(
      "START - END: " + startOfMonth.toString() + " " + endOfMonth.toString()
    );

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
    );

    return {
      remarks: remarkReturn,
      message: null
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
      .then((res) => res.numInsertedOrUpdatedRows);

    if (!count || count <= 0) return { message: "Insertion fail." };

    return {
      message: null
    };
  };
}

export default PeriodRemarkService;
