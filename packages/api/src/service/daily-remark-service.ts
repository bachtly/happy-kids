import { inject, injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import moment from "moment/moment";
import { v4 as uuidv4 } from "uuid";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import { z } from "zod";
import { Activity } from "../router/remark/daily-remark-protocols";

@injectable()
class DailyRemarkService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface,
    @inject("PhotoService") private photoService: PhotoServiceInterface
  ) {}

  getDailyRemarkList = async (
    timeStart: Date,
    timeEnd: Date,
    studentId: string
  ) => {
    console.log(
      `getDailyRemarkList receive request ${JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd,
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

    const remarkActivities = await Promise.all(
      await this.mysqlDB
        .selectFrom("DailyRemark")
        .innerJoin(
          "DailyRemarkActivity as Activity",
          "DailyRemark.id",
          "Activity.dailyRemarkId"
        )
        .innerJoin("User as Teacher", "DailyRemark.teacherId", "Teacher.id")
        .select([
          "DailyRemark.id",
          "DailyRemark.date",
          "Activity.activity",
          "Activity.content",
          "Teacher.fullname as teacherFullname",
          "Teacher.avatarUrl as teacherAvatarUrl",
          "DailyRemark.studentId as studentId",
          "DailyRemark.teacherId as teacherId"
        ])
        .where("date", ">=", timeStart)
        .where("date", "<=", timeEnd)
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

    const ids = Array.from(new Set(remarkActivities.map((item) => item.id)));

    const remarkReturn = ids.map((id) => {
      let date: Date | null = null;
      let teacherFullname: string | null = null;
      let teacherAvatar: string | null = null;
      let studentId: string | null = null;
      let teacherId: string | null = null;

      const activities = remarkActivities
        .filter((activity) => activity.id === id)
        .map((activity) => {
          date = activity.date;
          teacherFullname = activity.teacherFullname;
          teacherAvatar = activity.teacherAvatar;
          studentId = activity.studentId;
          teacherId = activity.teacherId;
          return {
            activity: activity.activity,
            content: activity.content
          };
        });

      return {
        id: id,
        date: date,
        teacherFullname: teacherFullname,
        teacherAvatar: teacherAvatar,
        activities: activities,
        studentId: studentId,
        teacherId: teacherId
      };
    });

    return {
      remarks: remarkReturn
    };
  };

  getDailyRemarkListFromClassId = async (time: Date, classId: string) => {
    console.log(
      `getDailyRemarkListFromClassId receive request ${JSON.stringify({
        time: time,
        classId: classId
      })}`
    );

    const startOfDate = moment(moment(time).format("MM/DD/YYYY")).toDate();
    const endOfDate = moment(moment(time).format("MM/DD/YYYY"))
      .add(1, "day")
      .toDate();

    const remarkActivities = await Promise.all(
      await this.mysqlDB
        .selectFrom("Student")
        .innerJoin(
          "StudentClassRelationship",
          "Student.id",
          "StudentClassRelationship.studentId"
        )
        .leftJoin(
          this.mysqlDB
            .selectFrom("DailyRemark")
            .leftJoin(
              "DailyRemarkActivity as Activity",
              "DailyRemark.id",
              "Activity.dailyRemarkId"
            )
            .select([
              "DailyRemark.id",
              "date",
              "activity",
              "content",
              "studentId",
              "teacherId"
            ])
            .where("date", "<=", endOfDate)
            .where("date", ">=", startOfDate)
            .as("DailyRemark"),
          "DailyRemark.studentId",
          "Student.id"
        )
        .select([
          "Student.fullname as studentFullname",
          "Student.avatarUrl",
          "Student.id as studentId",
          "DailyRemark.id as remarkId",
          "DailyRemark.date",
          "DailyRemark.activity",
          "DailyRemark.content",
          "DailyRemark.teacherId as teacherId"
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

    const ids = Array.from(
      new Set(remarkActivities.map((item) => item.studentId))
    );

    const remarkReturn = ids.map((id) => {
      let date: Date | null = null;
      let studentFullname: string | null = null;
      let studentAvatar: string | null = null;
      let remarkId: string | null = null;
      let teacherId: string | null = null;

      const activities = remarkActivities
        .filter((activity) => activity.studentId === id)
        .map((activity) => {
          date = activity.date;
          studentFullname = activity.studentFullname;
          studentAvatar = activity.studentAvatar;
          remarkId = activity.remarkId;
          teacherId = activity.teacherId;
          return {
            activity: activity.activity,
            content: activity.content
          };
        });

      return {
        id: remarkId,
        date: date,
        studentFullname: studentFullname,
        studentAvatar: studentAvatar,
        activities: activities,
        teacherId: teacherId,
        studentId: id
      };
    });

    return {
      remarks: remarkReturn
    };
  };

  insertDailyRemark = async (
    date: Date | null,
    studentId: string | null,
    teacherId: string | null
  ) => {
    console.log(
      `insertDailyRemark receive request ${JSON.stringify({
        date: date,
        studentId: studentId,
        teacherId: teacherId
      })}`
    );

    const id = uuidv4();

    const count = await this.mysqlDB
      .insertInto("DailyRemark")
      .values({
        id: id,
        date: date,
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

    return id;
  };

  insertDailyRemarkActivity = async (
    activities: z.infer<typeof Activity>[],
    remarkId: string | null,
    date: Date | null,
    studentId: string | null,
    teacherId: string | null
  ) => {
    console.log(
      `insertDailyRemarkActivity receive request ${JSON.stringify({
        activities: activities,
        remarkId: remarkId,
        date: date,
        studentId: studentId,
        teacherId: teacherId
      })}`
    );

    if (remarkId === null) {
      remarkId = await this.insertDailyRemark(date, studentId, teacherId);
    } else {
      await this.mysqlDB
        .deleteFrom("DailyRemarkActivity")
        .where("dailyRemarkId", "=", remarkId)
        .execute();
    }

    activities.map(async ({ type, content }) => {
      const count = await this.mysqlDB
        .replaceInto("DailyRemarkActivity")
        .values({
          activity: type,
          content: content,
          dailyRemarkId: remarkId
        })
        .executeTakeFirstOrThrow()
        .then((res) => res.numInsertedOrUpdatedRows)
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });

      if (!count || count <= 0) throw SYSTEM_ERROR_MESSAGE;
    });

    return {};
  };
}

export default DailyRemarkService;
