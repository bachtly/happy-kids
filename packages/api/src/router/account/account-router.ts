import { accountService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { GetAccountInfo, UpdateAccountInfo, UpdatePassword } from "./protocols";

export const accountRouter = createTRPCRouter({
  getAccountInfo: protectedProcedure
    .input(GetAccountInfo)
    .query(async ({ input }) => {
      return await accountService.getAccountInfo(input.userId);
    }),
  updateAccountInfo: protectedProcedure
    .input(UpdateAccountInfo)
    .mutation(async ({ input }) => {
      return await accountService.updateAccountInfo(
        input.userId,
        input.accountInfo
      );
    }),
  updatePassword: protectedProcedure
    .input(UpdatePassword)
    .mutation(async ({ input }) => {
      return await accountService.updatePassword(
        input.userId,
        input.oldPass,
        input.newPass
      );
    })
});
