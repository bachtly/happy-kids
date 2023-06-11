import { loginService } from "../../service/common-services";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "../../trpc";

import { LoginParams } from "./protocols";

export const authRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return "you can see this secret message!";
  }),
  userLogin: publicProcedure
    .input(LoginParams)
    .mutation(
      async ({ ctx, input }) =>
        await loginService.loginUser(ctx, input.username, input.password)
    )
});
