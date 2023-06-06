import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetDisabledTopicsResponse,
  GetNotiListRequest,
  GetNotiListResponse,
  RegisterTokenRequest,
  UpdateDisabledTopicsResponse
} from "./protocols";
import { notiService } from "../../service/common-services";

const notiRouter = createTRPCRouter({
  getNotiList: protectedProcedure
    .input(GetNotiListRequest)
    .output(GetNotiListResponse)
    .mutation(
      async ({ ctx, input }) =>
        await notiService.getNotiList(ctx.user.userId, input.classId)
    ),

  registerToken: protectedProcedure
    .input(RegisterTokenRequest)
    .mutation(
      async ({ ctx, input }) =>
        await notiService.registerToken(ctx.user.userId, input.token)
    ),

  getDisabledTopics: protectedProcedure
    .output(GetDisabledTopicsResponse)
    .mutation(
      async ({ ctx }) =>
        await notiService
          .getUserNotification(ctx.user.userId)
          .then((resp) => ({ disabledTopics: resp?.disabledTopics ?? [] }))
    ),

  updateDisabledTopics: protectedProcedure
    .input(UpdateDisabledTopicsResponse)
    .mutation(
      async ({ ctx, input }) =>
        await notiService.updateDisabledTopics(
          input.disabledTopics,
          ctx.user.userId
        )
    )
});

export { notiRouter };
