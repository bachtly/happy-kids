import { createTRPCRouter, publicProcedure } from "../../trpc";
import { GetNotiListRequest, GetNotiListResponse } from "./protocols";
import { notiService } from "../../service/common-services";

const notiRouter = createTRPCRouter({
  getNotiList: publicProcedure
    .input(GetNotiListRequest)
    .output(GetNotiListResponse)
    .mutation(
      async ({ input }) =>
        await notiService.getNotiList(input.userId, input.classId)
    )
});

export { notiRouter };
