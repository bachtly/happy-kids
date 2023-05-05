import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { GetNotiListRequest, GetNotiListResponse } from "./protocols";
import { notiService } from "../../service/common-services";

const notiRouter = createTRPCRouter({
  getNotiList: protectedProcedure
    .input(GetNotiListRequest)
    .output(GetNotiListResponse)
    .mutation(
      async ({ ctx, input }) =>
        await notiService.getNotiList(ctx.user.userId, input.classId)
    )
});

export { notiRouter };
