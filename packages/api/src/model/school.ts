import { z } from "zod";

export const SchoolModelZod = z.object({
  schoolId: z.string(),
  schoolAddress: z.string().nullable(),
  schoolName: z.string(),
  createdAt: z.date()
});
export const SchoolModel = z.array(SchoolModelZod);
