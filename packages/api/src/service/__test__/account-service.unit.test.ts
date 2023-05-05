import "reflect-metadata";
import AccountService from "../account-service";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { PhotoServiceInterface } from "../../utils/PhotoService";
import {
  SYSTEM_ERROR_MESSAGE,
  WRONG_ERROR_MESSAGE
} from "../../utils/errorHelper";

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
          errMess: SYSTEM_ERROR_MESSAGE,
          match: false
        }
      }
    ];

    it.each(dataSet)("$testName", async ({ userId, password, expected }) => {
      const accountService = new AccountService(
        {
          ...mockQueryBuilder,
          executeTakeFirstOrThrow: jest.fn().mockImplementation(() => {
            if (userId !== "user1")
              return Promise.reject(new Error("no result"));
            return Promise.resolve({ password: "rightpass" });
          })
        } as unknown as Kysely<DB>,
        mockPhotoService
      );
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
          errMess: SYSTEM_ERROR_MESSAGE
        }
      }
    ];

    it.each(dataSet)("$testName", async ({ userId, expected }) => {
      const accountService = new AccountService(
        {
          ...mockQueryBuilder,
          executeTakeFirstOrThrow: jest.fn().mockImplementation(() => {
            if (userId !== "user1")
              return Promise.reject(new Error("no result"));
            return Promise.resolve({
              email: expected.email,
              phone: expected.phone
            });
          })
        } as unknown as Kysely<DB>,
        mockPhotoService
      );
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
          errMess: WRONG_ERROR_MESSAGE
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
        const accountService = new AccountService(
          {
            ...mockQueryBuilder,
            executeTakeFirstOrThrow: jest
              .fn()
              .mockImplementationOnce(() => {
                if (userId !== "user1")
                  return Promise.reject(new Error("no result"));
                return Promise.resolve({ password: "rightpass" });
              })
              .mockResolvedValue({ numUpdatedRows: BigInt(1) })
          } as unknown as Kysely<DB>,
          mockPhotoService
        );
        await accountService
          .updatePassword(userId, oldPass, newPass)
          .catch((e: unknown) => expect(e).toBe(expected.errMess));
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
            .mockResolvedValue({ numUpdatedRows: BigInt(1) })
        } as unknown as Kysely<DB>,
        mockPhotoService
      );
      await accountService
        .updateAccountInfo(userId, accountInfo)
        .catch((e: unknown) => expect(e).toBe(expected.errMess));
    });
  });
});
