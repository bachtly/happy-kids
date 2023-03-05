import { attendanceService } from "../../service/common-services";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  GetAttendanceListRequest,
  GetAttendanceListResponse
} from "./protocols";

const attendanceRouter = createTRPCRouter({
  getAttendanceList: publicProcedure
    .input(GetAttendanceListRequest)
    .output(GetAttendanceListResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.getAttendanceListService(
          input.timeStart,
          input.timeEnd,
          input.studentId
        )
    )
});

export { attendanceRouter };
