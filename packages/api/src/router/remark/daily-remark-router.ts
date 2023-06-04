import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetDailyRemarkListFromClassIdRequest,
  GetDailyRemarkListFromClassIdResponse,
  GetDailyRemarkListRequest,
  GetDailyRemarkListResponse,
  InsertDailyRemarkActivityRequest,
  InsertDailyRemarkActivityResponse
} from "./daily-remark-protocols";
import { dailyRemarkService } from "../../service/common-services";

const dailyRemarkRouter = createTRPCRouter({
  getDailyRemarkList: protectedProcedure
    .input(GetDailyRemarkListRequest)
    .output(GetDailyRemarkListResponse)
    .mutation(
      async ({ input }) =>
        await dailyRemarkService.getDailyRemarkList(
          input.timeStart,
          input.timeEnd,
          input.studentId
        )
    ),

  getDailyRemarkListFromClassId: protectedProcedure
    .input(GetDailyRemarkListFromClassIdRequest)
    .output(GetDailyRemarkListFromClassIdResponse)
    .mutation(
      async ({ input }) =>
        await dailyRemarkService.getDailyRemarkListFromClassId(
          input.time,
          input.classId
        )
    ),

  insertDailyRemarkActivity: protectedProcedure
    .input(InsertDailyRemarkActivityRequest)
    .output(InsertDailyRemarkActivityResponse)
    .mutation(
      async ({ ctx, input }) =>
        await dailyRemarkService.insertDailyRemarkActivity(
          input.activities,
          input.remarkId,
          input.date,
          input.studentId,
          ctx.session.user.id
        )
    )
});

export { dailyRemarkRouter };
