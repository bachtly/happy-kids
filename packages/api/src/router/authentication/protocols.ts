import { z } from "zod";

// Define the params and response format for auth-router
const SignupParams = z.object({
  fullname: z.string(),
  username: z.string(),
  password: z.string(),
  emailAddr: z.string()
});

const LoginParams = z.object({
  username: z.string(),
  password: z.string()
});

const LoginStatus = z.enum(["Success", "Fail"]);
const LoginResponse = z.object({
  status: LoginStatus,
  message: z.string()
});

export { LoginResponse, SignupParams, LoginStatus, LoginParams };
