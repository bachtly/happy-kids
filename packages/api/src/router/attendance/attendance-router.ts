import { attendanceService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  CheckInRequest,
  CheckInResponse,
  CheckOutRequest,
  CheckOutResponse,
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
  getAttendanceList: protectedProcedure
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

  getAttendanceItemDetail: protectedProcedure
    .input(GetAttendanceItemDetailRequest)
    .output(GetAttendanceItemDetailResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.getAttendanceItemDetail(input.id)
    ),

  getAttendanceStatistics: protectedProcedure
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

  getStudentList: protectedProcedure
    .input(GetStudentListRequest)
    .output(GetStudentListResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.getStudentList(input.classId, input.date)
    ),

  checkin: protectedProcedure
    .input(CheckInRequest)
    .output(CheckInResponse)
    .mutation(
      async ({ ctx, input }) =>
        await attendanceService.checkin(
          input.studentId,
          input.status,
          input.note ?? "",
          ctx.user.userId,
          input.photos ?? []
        )
    ),

  checkout: protectedProcedure
    .input(CheckOutRequest)
    .output(CheckOutResponse)
    .mutation(
      async ({ ctx, input }) =>
        await attendanceService.checkout(
          input.studentId,
          input.note ?? "",
          input.time,
          ctx.user.userId,
          input.photos ?? [],
          input.pickerRelativeId ?? ""
        )
    )
});

export { attendanceRouter };
