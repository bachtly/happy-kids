import { Moment } from "moment";

interface AccountInfoModel {
  fullname: string;
  email: string;
  phone: string;
  birthdate: Moment | null;
  avatar: string;
}

export type { AccountInfoModel };
