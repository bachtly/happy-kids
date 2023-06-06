import { accountService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { GetAccountInfo, UpdateAccountInfo, UpdatePassword } from "./protocols";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
  getAccountInfo: protectedProcedure
    .input(GetAccountInfo)
    .query(async ({ ctx }) => {
      return await accountService.getAccountInfo(ctx.user.userId);
    }),
  updateAccountInfo: protectedProcedure
    .input(UpdateAccountInfo)
    .mutation(async ({ ctx, input }) => {
      return await accountService.updateAccountInfo(
        ctx.user.userId,
        input.accountInfo
      );
    }),
  updatePassword: protectedProcedure
    .input(UpdatePassword)
    .mutation(async ({ ctx, input }) => {
      return await accountService.updatePassword(
        ctx.user.userId,
        input.oldPass,
        input.newPass
      );
    }),
  getParentChildren: protectedProcedure.query(async ({ ctx }) => {
    return await accountService.getParentChildren(ctx.user.userId);
  }),
  getStudentInfoParent: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await accountService.getStudentInfoParent(input, ctx.user.userId);
    })
});
