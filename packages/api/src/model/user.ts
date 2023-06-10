import { z } from "zod";

export const EmployeeRoleZod = z.enum(["Manager", "Teacher"]);

export type EmployeeRole = z.infer<typeof EmployeeRoleZod>;

export const UserGroupZod = z.enum(["Parent", "Employee", "Admin"]);
export type UserGroup = z.infer<typeof UserGroupZod>;

export const UserInfoZod = z.object({
  id: z.string(),
  fullname: z.string(),
  birthdate: z.date().nullable(),
  email: z.string(),
  phone: z.string().nullable(),
  schoolId: z.string().nullable(),
  employeeRole: EmployeeRoleZod.nullable(),
  isAdmin: z.boolean()
});

export type UserInfo = z.infer<typeof UserInfoZod>;
