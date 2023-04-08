import { createTRPCRouter, publicProcedure } from "../../trpc";
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
  getDailyRemarkList: publicProcedure
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

  getDailyRemarkListFromClassId: publicProcedure
    .input(GetDailyRemarkListFromClassIdRequest)
    .output(GetDailyRemarkListFromClassIdResponse)
    .mutation(
      async ({ input }) =>
        await dailyRemarkService.getDailyRemarkListFromClassId(
          input.time,
          input.classId
        )
    ),

  insertDailyRemarkActivity: publicProcedure
    .input(InsertDailyRemarkActivityRequest)
    .output(InsertDailyRemarkActivityResponse)
    .mutation(
      async ({ input }) =>
        await dailyRemarkService.insertDailyRemarkActivity(
          input.activity,
          input.content,
          input.remarkId,
          input.date,
          input.studentId,
          input.teacherId
        )
    )
});

export { dailyRemarkRouter };
