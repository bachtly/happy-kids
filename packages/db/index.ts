import { Kysely, MysqlDialect } from "kysely";
import { DB } from "kysely-codegen";
import mysql from "mysql2";
import fs from "fs";
import { join } from "path";

const globalForDB = globalThis as unknown as {
  mysqlDB: Kysely<DB>;
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  port: parseInt(process.env.DB_PORT ?? "3000"),
  waitForConnections: true,
  connectionLimit: 10,
  // maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  // idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
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

/**
 *  Run sql script schema.sql and seed.sql for testing
 *
 *  This will reset your database!
 * @returns test database
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const getTestDB = async () => {
  const poolTmp = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? "3000"),
    waitForConnections: true,
    connectionLimit: 10,
    // maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    // idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    multipleStatements: true
  });
  const testSchema = process.env.DB_SCHEMA_TEST;

  if (!testSchema) throw Error("please define DB_SCHEMA_TEST in .env");
  const schemaPath = join(__dirname, "../../mysql/schema.sql");
  const schemaScript = fs
    .readFileSync(schemaPath)
    .toString()
    .replaceAll("KindergartenSchema", `${testSchema}`);

  const seedPath = join(__dirname, "../../mysql/seed.sql");
  const seedScript = fs
    .readFileSync(seedPath)
    .toString()
    .replaceAll("KindergartenSchema", `${testSchema}`);

  await poolTmp.promise().query(schemaScript);
  await poolTmp.promise().query(seedScript);
  return new Kysely<DB>({
    dialect: new MysqlDialect({
      pool: poolTmp
    })
  });
};
