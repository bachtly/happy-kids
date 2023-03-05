import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { injectable } from "tsyringe";

@injectable()
class AttendanceService {
  constructor(private mysqlDB: Kysely<DB>) {}

  getAttendanceListService = async (
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
      .select(["date", "status", "checkinNote", "checkoutNote"])
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
}

export default AttendanceService;
