// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { UserGroup } from "@acme/api/src/model/user";

declare module "next-auth" {
  interface User {
    id: string;
    userGroup: UserGroup | null;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}
