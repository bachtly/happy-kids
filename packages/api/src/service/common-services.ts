import { mysqlDB } from "@acme/db";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import "reflect-metadata";
import { container } from "tsyringe";
import LoginService from "./login-service";

container.register<Kysely<DB>>(Kysely, { useValue: mysqlDB });

export const loginService = container.resolve(LoginService);
