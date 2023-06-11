import { z } from "zod";
// Define the params and response format for auth-router

const LoginParams = z.object({
  username: z.string(),
  password: z.string()
});

const LoginResponse = z.object({
  success: z.boolean(),
  accessToken: z.string().nullable(),
  userId: z.string().nullable(),
  classId: z.string().nullable(),
  studentId: z.string().nullable().optional(),
  isTeacher: z.boolean()
});

export { LoginResponse, LoginParams };
