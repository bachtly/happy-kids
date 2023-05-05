import { z } from "zod";

const Noti = z.object({
  id: z.string(),
  title: z.nullable(z.string()),
  content: z.nullable(z.string()),
  route: z.nullable(z.string()),
  photo: z.nullable(z.string()),
  time: z.nullable(z.date())
});

const GetNotiListRequest = z.object({
  classId: z.string()
});

const GetNotiListResponse = z.object({
  notis: z.array(Noti)
});

export { GetNotiListRequest, GetNotiListResponse };
