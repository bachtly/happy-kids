import "reflect-metadata";
import AccountService from "../account-service";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { getTestDB } from "@acme/db";
import { FileServiceInterface } from "../../utils/FileService";
import { PhotoService } from "../../utils/PhotoService";

class MockFileService implements FileServiceInterface {
  storage = "";
  readFileBase64 = (_: string) => {
    return Promise.resolve("");
  };
  asyncReadFile = async (_: string) => {
    return Promise.resolve(this.storage);
  };
  asyncWriteFile = async (_: string, data: string) => {
    this.storage = await Promise.resolve(data);
  };
}

describe("AccountService", () => {
  let accountService: AccountService;
  let mysqlDB: Kysely<DB>;

  beforeAll(async () => {
    mysqlDB = await getTestDB();
    accountService = new AccountService(
      mysqlDB,
      new PhotoService(new MockFileService())
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
          errMess: "no result",
          match: false
        }
      }
    ];
    it.each(dataSet)("$testName", async ({ userId, password, expected }) => {
      expect(await accountService.checkPassword(userId, password)).toEqual(
        expected
      );
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
        testName: "not match pass",
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
          errMess: "no result"
        }
      }
    ];
    it.each(dataSet)("$testName", async ({ userId, expected }) => {
      const got = await accountService.getAccountInfo(userId);
      expect(got.errMess).toBe(expected.errMess);
      if (expected.email) expect(got.res?.email).toBe(expected.email);
      if (expected.phone) expect(got.res?.phone).toBe(expected.phone);
    });
  });

  /**
   * updatePassword then checkPassword
   */
  describe("updatePassword then checkPassword", () => {
    const dataSet = [
      {
        testName: "no error",
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
          errMess: "wrong_pass",
          newPass: "newpass123"
        }
      },
      {
        testName: "not exist userId",
        userId: "blahblah",
        oldPass: "blahblah",
        newPass: "blahblah",
        expected: {
          errMess: "other"
        }
      }
    ];
    it.each(dataSet)(
      "$testName",
      async ({ userId, oldPass, newPass, expected }) => {
        const got = await accountService.updatePassword(
          userId,
          oldPass,
          newPass
        );
        expect(got).toBe(expected.errMess);
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
        testName: "no error",
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
      const got = await accountService.updateAccountInfo(userId, accountInfo);
      expect(got.errMess).toBe(expected.errMess);
      if (expected.newAccountInfo) {
        const gotAccInfo = await accountService.getAccountInfo(userId);
        expect(gotAccInfo.res).toEqual(expected.newAccountInfo);
      }
    });
  });
});
