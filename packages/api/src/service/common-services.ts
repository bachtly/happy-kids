import { mysqlDB } from "@acme/db";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import "reflect-metadata";
import { container } from "tsyringe";

container.register<Kysely<DB>>(Kysely, { useValue: mysqlDB });
