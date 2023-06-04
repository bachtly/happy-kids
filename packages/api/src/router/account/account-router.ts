import { accountService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { GetAccountInfo, UpdateAccountInfo, UpdatePassword } from "./protocols";

export const accountRouter = createTRPCRouter({
  getAccountInfo: protectedProcedure
    .input(GetAccountInfo)
    .query(async ({ ctx }) => {
      return await accountService.getAccountInfo(ctx.session.user.id);
    }),
  updateAccountInfo: protectedProcedure
    .input(UpdateAccountInfo)
    .mutation(async ({ ctx, input }) => {
      return await accountService.updateAccountInfo(
        ctx.session.user.id,
        input.accountInfo
      );
    }),
  updatePassword: protectedProcedure
    .input(UpdatePassword)
    .mutation(async ({ ctx, input }) => {
      return await accountService.updatePassword(
        ctx.session.user.id,
        input.oldPass,
        input.newPass
      );
    })
});
