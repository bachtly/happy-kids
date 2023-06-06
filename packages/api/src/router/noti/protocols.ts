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

const RegisterTokenRequest = z.object({
  token: z.string().nullable().optional()
});

const GetDisabledTopicsResponse = z.object({
  disabledTopics: z.array(z.string())
});

const UpdateDisabledTopicsResponse = z.object({
  disabledTopics: z.array(z.string())
});

export { GetNotiListRequest, GetNotiListResponse };
export { RegisterTokenRequest };
export { GetDisabledTopicsResponse };
export { UpdateDisabledTopicsResponse };
