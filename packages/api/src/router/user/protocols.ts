import { z } from "zod";

export const GetUserDetailInfoParamsZod = z.object({
  userId: z.string()
});
