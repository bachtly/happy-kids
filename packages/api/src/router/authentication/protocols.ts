import { z } from "zod";
// Define the params and response format for auth-router

const LoginParams = z.object({
  email: z.string(),
  password: z.string()
});

const LoginStatus = z.enum(["Success", "Fail"]);
const LoginResponse = z.object({
  status: LoginStatus,
  userId: z.string().nullable()
});

const CheckEmailExistenceParams = z.object({
  email: z.string()
});

const CheckEmailExistenceResp = z.object({
  isExisted: z.boolean()
});

const SignupParams = z.object({
  email: z.string(),
  password: z.string(),
  fullName: z.string()
});

export {
  LoginResponse,
  LoginStatus,
  LoginParams,
  CheckEmailExistenceParams,
  CheckEmailExistenceResp,
  SignupParams
};
