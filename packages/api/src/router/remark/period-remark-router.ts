import { createTRPCRouter, protectedProcedure } from "../../trpc";
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
  getPeriodRemarkList: protectedProcedure
    .input(GetPeriodRemarkListRequest)
    .output(GetPeriodRemarkListResponse)
    .mutation(
      async ({ input }) =>
        await periodRemarkService.getPeriodRemarkList(input.studentId)
    ),

  getPeriodRemarkListFromClassId: protectedProcedure
    .input(GetPeriodRemarkListFromClassIdRequest)
    .output(GetPeriodRemarkListFromClassIdResponse)
    .mutation(
      async ({ input }) =>
        await periodRemarkService.getPeriodRemarkListFromClassId(
          input.time,
          input.classId
        )
    ),

  insertPeriodRemark: protectedProcedure
    .input(InsertPeriodRemarkRequest)
    .output(InsertPeriodRemarkResponse)
    .mutation(
      async ({ ctx, input }) =>
        await periodRemarkService.insertPeriodRemark(
          input.id,
          input.period,
          input.content,
          input.startTime,
          input.endTime,
          input.studentId,
          ctx.session.user.id
        )
    )
});

export { periodRemarkRouter };
