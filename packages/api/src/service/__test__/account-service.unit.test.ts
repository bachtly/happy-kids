import "reflect-metadata";
import AccountService from "../account-service";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { PhotoServiceInterface } from "../../utils/PhotoService";

jest.mock("bcryptjs", () => {
  return {
    compare: jest.fn().mockImplementation((s: string, hash: string) => {
      return s === hash;
    }),
    hash: jest.fn().mockReturnValue("password_hased")
  };
});
class MockPhotoService implements PhotoServiceInterface {
  getPhotoFromPath = (_: string) => {
    return Promise.resolve("photocontent");
  };
  storePhoto = (_: string, __: string) => {
    return "photopath";
  };
}
const mockPhotoService = new MockPhotoService();

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  selectFrom: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  updateTable: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis()
};

describe("AccountService", () => {
  /**
   * checkPassword
   */
  describe("checkPassword", () => {
    const dataSet = [
      {
        testName: "match pass",
        userId: "user1",
        password: "rightpass",
        expected: {
          errMess: "",
          match: true
        }
      },
      {
        testName: "not match pass",
        userId: "user1",
        password: "wrongpass",
        expected: {
          errMess: "",
          match: false
        }
      },
      {
        testName: "not exist userId",
        userId: "notAId",
        password: "noneed",
        expected: {
          errMess: "no result",
          match: false
        }
      }
    ];

    it.each(dataSet)("$testName", async ({ userId, password, expected }) => {
      const accountService = new AccountService(
        {
          ...mockQueryBuilder,
          executeTakeFirstOrThrow: jest.fn().mockImplementation(() => {
            if (userId !== "user1") throw Error("no result");
            return { password: "rightpass" };
          })
        } as unknown as Kysely<DB>,
        mockPhotoService
      );
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
        testName: "success",
        userId: "user1",
        expected: {
          errMess: "",
          email: "example@gmail.com",
          phone: "012345"
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
      const accountService = new AccountService(
        {
          ...mockQueryBuilder,
          executeTakeFirstOrThrow: jest.fn().mockImplementation(() => {
            if (userId !== "user1") throw Error("no result");
            return {
              email: expected.email,
              phone: expected.phone
            };
          })
        } as unknown as Kysely<DB>,
        mockPhotoService
      );
      const got = await accountService.getAccountInfo(userId);
      expect(got.errMess).toBe(expected.errMess);
      if (expected.email) expect(got.res?.email).toBe(expected.email);
      if (expected.phone) expect(got.res?.phone).toBe(expected.phone);
    });
  });

  /**
   * updatePassword
   */
  describe("updatePassword", () => {
    const dataSet = [
      {
        testName: "success",
        userId: "user1",
        oldPass: "rightpass",
        newPass: "newpass",
        expected: {
          errMess: ""
        }
      },
      {
        testName: "wrong password",
        userId: "user1",
        oldPass: "wrongpass",
        newPass: "newpass",
        expected: {
          errMess: "wrong_pass"
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
        const accountService = new AccountService(
          {
            ...mockQueryBuilder,
            executeTakeFirstOrThrow: jest
              .fn()
              .mockImplementationOnce(() => {
                if (userId !== "user1") throw Error("no result");
                return { password: "rightpass" };
              })
              .mockReturnValue({ numUpdatedRows: BigInt(1) })
          } as unknown as Kysely<DB>,
          mockPhotoService
        );
        const got = await accountService.updatePassword(
          userId,
          oldPass,
          newPass
        );
        expect(got).toBe(expected.errMess);
      }
    );
  });

  /**
   * updateAccountInfo
   */
  describe("updateAccountInfo", () => {
    const dataSet = [
      {
        testName: "success",
        userId: "user1",
        accountInfo: {
          fullname: "newName",
          email: "newEmail",
          phone: "012345",
          birthdate: new Date(0),
          avatar: "newPhoto"
        },
        expected: {
          errMess: ""
        }
      }
    ];
    it.each(dataSet)("$testName", async ({ userId, accountInfo, expected }) => {
      const accountService = new AccountService(
        {
          ...mockQueryBuilder,
          executeTakeFirstOrThrow: jest
            .fn()
            .mockReturnValue({ numUpdatedRows: BigInt(1) })
        } as unknown as Kysely<DB>,
        mockPhotoService
      );
      const got = await accountService.updateAccountInfo(userId, accountInfo);
      expect(got.errMess).toBe(expected.errMess);
    });
  });
});
