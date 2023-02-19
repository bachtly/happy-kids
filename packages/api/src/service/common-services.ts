import { mysqlDB } from "@acme/db";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import "reflect-metadata";
import { container } from "tsyringe";
import LoginService from "./login-service";
import SignupService from "./signup-service";

container.register<Kysely<DB>>(Kysely, { useValue: mysqlDB });
export const signupService = container.resolve(SignupService);
export const loginService = container.resolve(LoginService);
