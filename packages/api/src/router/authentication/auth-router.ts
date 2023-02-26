import { loginService } from "../../service/common-services";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "../../trpc";
import { LoginParams } from "./protocols";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return "you can see this secret message!";
  }),
  userLogin: publicProcedure.input(LoginParams).mutation(async ({ input }) => {
    return await loginService.loginUser(input.username, input.password);
  })
});
