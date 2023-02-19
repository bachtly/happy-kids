import { Kysely, MysqlDialect } from "kysely";
import { DB } from "kysely-codegen";
import mysql from "mysql2";

export * from "@prisma/client";

const globalForDB = globalThis as unknown as {
  mysqlDB: Kysely<DB>;
};

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "KindergartenSchema",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0
});

export const mysqlDB =
  globalForDB.mysqlDB ||
  new Kysely<DB>({
    dialect: new MysqlDialect({
      pool: pool
    })
  });

if (process.env.NODE_ENV !== "production") {
  globalForDB.mysqlDB = mysqlDB;
}
