import { loginService, signupService } from "../../service/common-services";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "../../trpc";
import { LoginParams, LoginResponse, SignupParams } from "./protocols";
export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return "you can see this secret message!";
  }),
  signup: publicProcedure.input(SignupParams).mutation(({ input }) => {
    return signupService.signUpUser(
      input.fullname,
      input.username,
      input.password,
      input.emailAddr
    );
  }),
  login: publicProcedure
    .input(LoginParams)
    .output(LoginResponse)
    .mutation(async ({ input }) => {
      return await loginService.loginUser(input.username, input.password);
    })
});
