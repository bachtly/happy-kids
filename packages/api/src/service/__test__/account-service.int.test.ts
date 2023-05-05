import "reflect-metadata";
import AccountService from "../account-service";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { PhotoService } from "../../utils/PhotoService";
import { FileService } from "../../utils/FileService";
import { getTestDB } from "@acme/db";
import {
  SYSTEM_ERROR_MESSAGE,
  WRONG_ERROR_MESSAGE
} from "../../utils/errorHelper";

describe("AccountService", () => {
  let accountService: AccountService;
  let mysqlDB: Kysely<DB>;

  beforeAll(async () => {
    mysqlDB = await getTestDB();
    accountService = new AccountService(
      mysqlDB,
      new PhotoService(new FileService())
    );
  }, 10000);

  afterAll(async () => {
    try {
      await mysqlDB.destroy();
    } catch (_) {
      console.log("failed to disconnect");
    }
  });

  /**
   * checkPassword
   */
  describe("checkPassword", () => {
    const dataSet = [
      {
        testName: "match pass",
        userId: "mgrid100-0000-0000-0000-000000000000",
        password: "password123",
        expected: {
          errMess: "",
          match: true
        }
      },
      {
        testName: "not match pass",
        userId: "mgrid100-0000-0000-0000-000000000000",
        password: "password",
        expected: {
          errMess: "",
          match: false
        }
      },
      {
        testName: "not exist userId",
        userId: "blahblah",
        password: "password123",
        expected: {
          errMess: SYSTEM_ERROR_MESSAGE,
          match: false
        }
      }
    ];
    it.each(dataSet)("$testName", async ({ userId, password, expected }) => {
      await accountService
        .checkPassword(userId, password)
        .then((got) => {
          expect(got.match).toBe(expected.match);
        })
        .catch((e: unknown) => expect(e).toBe(expected.errMess));
    });
  });

  /**
   * getAccountInfo
   */
  describe("getAccountInfo", () => {
    const dataSet = [
      {
        testName: "principal",
        userId: "mgrid100-0000-0000-0000-000000000000",
        expected: {
          errMess: "",
          email: "bach.principal@gmail.com",
          phone: "0900000000"
        }
      },
      {
        testName: "parent",
        userId: "prid1000-0000-0000-0000-000000000000",
        expected: {
          errMess: "",
          email: "bach.parent1@gmail.com",
          phone: "0900000008"
        }
      },
      {
        testName: "not exist userId",
        userId: "blahblah",
        expected: {
          errMess: SYSTEM_ERROR_MESSAGE
        }
      }
    ];
    it.each(dataSet)("$testName", async ({ userId, expected }) => {
      await accountService
        .getAccountInfo(userId)
        .then((got) => {
          if (expected.email) expect(got.res?.email).toBe(expected.email);
          if (expected.phone) expect(got.res?.phone).toBe(expected.phone);
        })
        .catch((e: unknown) => expect(e).toBe(expected.errMess));
    });
  });

  /**
   * updatePassword then checkPassword
   */
  describe("updatePassword then checkPassword", () => {
    const dataSet = [
      {
        testName: "success",
        userId: "mgrid100-0000-0000-0000-000000000000",
        oldPass: "password123",
        newPass: "newpass123",
        expected: {
          errMess: "",
          newPass: "newpass123"
        }
      },
      {
        testName: "wrong password",
        userId: "mgrid100-0000-0000-0000-000000000000",
        oldPass: "blahblah",
        newPass: "blahblah",
        expected: {
          errMess: WRONG_ERROR_MESSAGE,
          newPass: "newpass123"
        }
      },
      {
        testName: "not exist userId",
        userId: "blahblah",
        oldPass: "blahblah",
        newPass: "blahblah",
        expected: {
          errMess: SYSTEM_ERROR_MESSAGE
        }
      }
    ];
    it.each(dataSet)(
      "$testName",
      async ({ userId, oldPass, newPass, expected }) => {
        await accountService
          .updatePassword(userId, oldPass, newPass)
          .catch((e: unknown) => expect(e).toBe(expected.errMess));

        if (expected.newPass) {
          const gotCheck = await accountService.checkPassword(
            userId,
            expected.newPass
          );
          expect(gotCheck.match).toBeTruthy();
        }
      }
    );
  });

  /**
   * updateAccountInfo then getAccountInfo
   */
  describe("updateAccountInfo then getAccountInfo", () => {
    const dataSet = [
      {
        testName: "success",
        userId: "mgrid100-0000-0000-0000-000000000000",
        accountInfo: {
          fullname: "newName",
          email: "newEmail",
          phone: "012345",
          birthdate: new Date(0),
          avatar: "newPhoto"
        },
        expected: {
          errMess: "",
          newAccountInfo: {
            fullname: "newName",
            email: "newEmail",
            phone: "012345",
            birthdate: new Date(0),
            avatar: "newPhoto"
          }
        }
      }
    ];
    it.each(dataSet)("$testName", async ({ userId, accountInfo, expected }) => {
      await accountService
        .updateAccountInfo(userId, accountInfo)
        .catch((e: unknown) => expect(e).toBe(expected.errMess));

      if (expected.newAccountInfo) {
        const gotAccInfo = await accountService.getAccountInfo(userId);
        expect(gotAccInfo.res).toEqual(expected.newAccountInfo);
      }
    });
  });
});
