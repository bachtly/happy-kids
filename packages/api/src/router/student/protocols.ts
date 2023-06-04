import { z } from "zod";
import { UserInfoZod } from "../../model/user";

export const StudentDisplayInfoZod = z.object({
  studentId: z.string(),
  fullname: z.string(),
  birthdate: z.date(),
  parentInfo: UserInfoZod
});

export type StudentWithParentInfo = z.infer<typeof StudentDisplayInfoZod>;
