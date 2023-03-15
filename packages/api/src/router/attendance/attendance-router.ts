import { attendanceService } from "../../service/common-services";
import { createTRPCRouter, publicProcedure } from "../../trpc";
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
      async ({ input }) =>
        await attendanceService.getStudentList(input.classId, input.date)
    ),

  checkin: publicProcedure
    .input(CheckInRequest)
    .output(CheckInResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.checkin(
          input.studentId,
          input.status,
          input.note ?? "",
          input.time,
          input.teacherId,
          input.photoUrl ?? ""
        )
    ),

  checkout: publicProcedure
    .input(CheckOutRequest)
    .output(CheckOutResponse)
    .mutation(
      async ({ input }) =>
        await attendanceService.checkout(
          input.studentId,
          input.note ?? "",
          input.time,
          input.teacherId,
          input.photoUrl ?? "",
          input.pickerRelativeId ?? ""
        )
    )
});

export { attendanceRouter };
