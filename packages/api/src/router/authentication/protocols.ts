import { z } from "zod";
// Define the params and response format for auth-router

const LoginParams = z.object({
  username: z.string(),
  password: z.string()
});

const LoginStatus = z.enum(["Success", "Fail"]);
const LoginResponse = z.object({
  status: LoginStatus,
  message: z.string(),
  userId: z.string().nullable()
});

export { LoginResponse, LoginStatus, LoginParams };
