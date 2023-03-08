import { attendanceService } from "../../service/common-services";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  GetAttendanceItemDetailRequest,
  GetAttendanceItemDetailResponse,
  GetAttendanceListRequest,
  GetAttendanceListResponse,
  GetAttendanceStatisticsRequest,
  GetAttendanceStatisticsResponse
} from "./protocols";

const attendanceRouter = createTRPCRouter({
  getAttendanceList: publicProcedure
    .input(GetAttendanceListRequest)
    .output(GetAttendanceListResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.getAttendanceList(
          input.timeStart,
          input.timeEnd,
          input.studentId
        )
    ),

  getAttendanceItemDetail: publicProcedure
    .input(GetAttendanceItemDetailRequest)
    .output(GetAttendanceItemDetailResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.getAttendanceItemDetail(input.id)
    ),

  getAttendanceStatistics: publicProcedure
    .input(GetAttendanceStatisticsRequest)
    .output(GetAttendanceStatisticsResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.getAttendanceStatistics(
          input.timeStart,
          input.timeEnd,
          input.studentId
        )
    )
});

export { attendanceRouter };
