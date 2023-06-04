import { userService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { GetUserDetailInfoParamsZod } from "./protocols";
import { UserInfoZod } from "../../model/user";

export const userRouter = createTRPCRouter({
  userInfo: protectedProcedure
    .input(GetUserDetailInfoParamsZod)
    .output(UserInfoZod)
    .query(async ({ input }) => {
      return await userService.getUserInfo(input.userId);
    })
});
