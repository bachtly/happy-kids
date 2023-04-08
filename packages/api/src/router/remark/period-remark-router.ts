import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  GetPeriodRemarkListFromClassIdRequest,
  GetPeriodRemarkListFromClassIdResponse,
  GetPeriodRemarkListRequest,
  GetPeriodRemarkListResponse,
  InsertPeriodRemarkRequest,
  InsertPeriodRemarkResponse
} from "./period-remark-protocols";
import { periodRemarkService } from "../../service/common-services";

const periodRemarkRouter = createTRPCRouter({
  getPeriodRemarkList: publicProcedure
    .input(GetPeriodRemarkListRequest)
    .output(GetPeriodRemarkListResponse)
    .mutation(
      async ({ input }) =>
        await periodRemarkService.getPeriodRemarkList(input.studentId)
    ),

  getPeriodRemarkListFromClassId: publicProcedure
    .input(GetPeriodRemarkListFromClassIdRequest)
    .output(GetPeriodRemarkListFromClassIdResponse)
    .mutation(
      async ({ input }) =>
        await periodRemarkService.getPeriodRemarkListFromClassId(
          input.time,
          input.classId
        )
    ),

  insertPeriodRemark: publicProcedure
    .input(InsertPeriodRemarkRequest)
    .output(InsertPeriodRemarkResponse)
    .mutation(
      async ({ input }) =>
        await periodRemarkService.insertPeriodRemark(
          input.period,
          input.content,
          input.startTime,
          input.endTime,
          input.studentId,
          input.teacherId
        )
    )
});

export { periodRemarkRouter };
