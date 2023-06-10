import { z } from "zod";
import { UserGroupZod } from "../../model/user";
// Define the params and response format for auth-router

export const LoginParams = z.object({
  username: z.string(),
  password: z.string()
});

export const LoginResponseZod = z.object({
  success: z.boolean(),
  accessToken: z.string().nullable(),
  userId: z.string().nullable(),
  classId: z.string().nullable(),
  studentId: z.string().nullable().optional(),
  isTeacher: z.boolean(),
  userGroup: UserGroupZod.nullable()
});

export type LoginResponse = z.infer<typeof LoginResponseZod>;

export const CheckEmailExistenceParams = z.object({
  email: z.string()
});

export const CheckEmailExistenceRespZod = z.object({
  isExisted: z.boolean()
});

export type CheckEmailExistenceResp = z.infer<
  typeof CheckEmailExistenceRespZod
>;

export const SignupParams = z.object({
  email: z.string(),
  password: z.string(),
  fullName: z.string()
});
