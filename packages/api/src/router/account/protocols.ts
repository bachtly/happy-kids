import { z } from "zod";

const AccountInfo = z.object({
  fullname: z.string(),
  email: z.string(),
  phone: z.string(),
  birthdate: z.date().nullable(),
  avatar: z.string()
});

const GetAccountInfo = z.object({});

const UpdateAccountInfo = z.object({
  accountInfo: AccountInfo
});

const UpdatePassword = z.object({
  oldPass: z.string(),
  newPass: z.string()
});

export { AccountInfo, GetAccountInfo, UpdateAccountInfo, UpdatePassword };
