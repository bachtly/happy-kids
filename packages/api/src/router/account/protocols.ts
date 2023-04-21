import { z } from "zod";

type UpdatePassError = "" | "wrong_pass" | "other";

const AccountInfo = z.object({
  fullname: z.string(),
  email: z.string(),
  phone: z.string(),
  birthdate: z.date().nullable(),
  avatar: z.string()
});

const GetAccountInfo = z.object({
  userId: z.string()
});

const UpdateAccountInfo = z.object({
  userId: z.string(),
  accountInfo: AccountInfo
});

const UpdatePassword = z.object({
  userId: z.string(),
  oldPass: z.string(),
  newPass: z.string()
});

export { AccountInfo, GetAccountInfo, UpdateAccountInfo, UpdatePassword };
export type { UpdatePassError };
