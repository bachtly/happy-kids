import { z } from "zod";

export const ClassModelZod = z.object({
  id: z.string(),
  schoolId: z.string(),
  name: z.string(),
  createdAt: z.date(),
  schoolYear: z.number()
});

export type ClassModel = z.infer<typeof ClassModelZod>;
