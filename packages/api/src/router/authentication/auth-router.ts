import { loginService, signupService } from "../../service/common-services";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "../../trpc";

import {
  CheckEmailExistenceParams,
  CheckEmailExistenceResp,
  LoginParams,
  LoginResponse,
  SignupParams
} from "./protocols";

import { z } from "zod";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return "you can see this secret message!";
  }),
  userLogin: publicProcedure
    .input(LoginParams)
    .output(LoginResponse)
    .mutation(async ({ input }) => {
      return await loginService.loginUser(input.email, input.password);
    }),
  checkEmailExistence: publicProcedure
    .input(CheckEmailExistenceParams)
    .output(CheckEmailExistenceResp)
    .mutation(async ({ input }) => {
      return await signupService.checkEmailExistence(input.email);
    }),
  userSignup: publicProcedure
    .input(SignupParams)
    .output(z.void())
    .mutation(async ({ input }) => {
      return await signupService.signupUser(
        input.email,
        input.password,
        input.fullName
      );
    })
});
