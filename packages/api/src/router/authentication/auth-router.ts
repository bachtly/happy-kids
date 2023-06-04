import { loginService, signupService } from "../../service/common-services";
import { createTRPCRouter, publicProcedure } from "../../trpc";

import {
  CheckEmailExistenceParams,
  CheckEmailExistenceRespZod,
  LoginParams,
  SignupParams
} from "./protocols";

import { z } from "zod";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  userLogin: publicProcedure
    .input(LoginParams)
    .mutation(
      async ({ input }) =>
        await loginService.loginUser(input.username, input.password)
    ),
  checkEmailExistence: publicProcedure
    .input(CheckEmailExistenceParams)
    .output(CheckEmailExistenceRespZod)
    .mutation(async ({ input }) => {
      return await signupService.checkEmailExistence(input.email);
    }),
  userSignup: publicProcedure
    .input(SignupParams)
    .output(z.void())
    .mutation(async ({ input }) => {
      return await signupService.signupUserExternalUser(
        input.email,
        input.password,
        input.fullName
      );
    })
});
