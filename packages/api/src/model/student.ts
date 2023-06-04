import { z } from "zod";

export const StudentModelZod = z.object({
  id: z.string(),
  fullname: z.string(),
  avatarUrl: z.string().nullable(),
  birthdate: z.date(),
  parentId: z.string()
});

export type StudentModel = z.infer<typeof StudentModelZod>;
