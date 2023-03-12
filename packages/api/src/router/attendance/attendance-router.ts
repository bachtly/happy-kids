import { attendanceService } from "../../service/common-services";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  CheckInRequest,
  CheckInResponse,
  GetAttendanceItemDetailRequest,
  GetAttendanceItemDetailResponse,
  GetAttendanceListRequest,
  GetAttendanceListResponse,
  GetAttendanceStatisticsRequest,
  GetAttendanceStatisticsResponse,
  GetStudentListRequest,
  GetStudentListResponse
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
    ),

  getStudentList: publicProcedure
    .input(GetStudentListRequest)
    .output(GetStudentListResponse)
    .mutation(
      async ({ input }) => await attendanceService.getStudentList(input.classId)
    ),

  checkIn: publicProcedure
    .input(CheckInRequest)
    .output(CheckInResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.checkIn(
          input.studentId,
          input.status,
          input.note ?? "",
          input.time,
          input.teacherId,
          input.photoUrl ?? ""
        )
    )
});

export { attendanceRouter };
