import { inject, injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import moment from "moment/moment";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import type { ExpoNotificationWrapperInterface } from "../utils/ExpoNotificationWrapper";
import cron from "node-cron";

enum NotificationTopics {
  Attendance = "Attendance",
  MedicineLetter = "MedicineLetter",
  LeaveLetter = "LeaveLetter",
  NoteLetter = "NoteLetter",
  PickupLetter = "PickupLetter",
  Post = "Post",
  Album = "Album"
}

@injectable()
class NotiService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("PhotoService") private photoService: PhotoServiceInterface,
    @inject("ExpoNotificationWrapper")
    private expoNotification: ExpoNotificationWrapperInterface
  ) {
    this.startJobUnregisterErrorTokens();
  }

  getNotiList = async (userId: string, classId: string) => {
    console.log(
      `getNotiList receive request ${JSON.stringify({
        userId: userId,
        classId: classId
      })}`
    );

    const notis = await Promise.all(
      await this.mysqlDB
        .selectFrom("Noti")
        .select([
          "Noti.id as id",
          "Noti.title as title",
          "Noti.content as content",
          "Noti.route as route",
          "Noti.photoUrl",
          "Noti.time"
        ])
        .where("Noti.userId", "=", userId)
        .orderBy("Noti.time", "desc")
        .execute()
        .then((resp) =>
          resp.flat().map(async (item) => {
            const photo = await this.photoService.getPhotoFromPath(
              item.photoUrl ?? ""
            );
            return {
              ...item,
              photo: photo
            };
          })
        )
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );

    return {
      notis: notis
    };
  };

  insertNoti = async (
    title: string,
    content: string,
    route: string,
    photoUrl: string,
    userId: string,
    topic: NotificationTopics
  ) => {
    console.log(
      `insertNoti receive request ${JSON.stringify({
        title: title,
        content: content,
        route: route,
        photoUrl: photoUrl,
        userId: userId,
        topic: topic
      })}`
    );

    const count = await this.mysqlDB
      .insertInto("Noti")
      .values({
        title: title,
        content: content,
        route: route,
        photoUrl: photoUrl,
        time: moment().toDate(),
        userId: userId
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (!count || count <= 0) throw SYSTEM_ERROR_MESSAGE;

    void this.pushNoti(title, content, route, photoUrl, userId, topic).catch(
      (err: Error) => {
        // Log, do not throw
        console.log(err);
      }
    );

    return {};
  };

  registerToken = async (userId: string, token?: string | null) => {
    console.log(
      `registerToken receive request ${JSON.stringify({
        token: token,
        userId: userId
      })}`
    );

    const userNotification = await this.getUserNotification(userId);

    if (!userNotification) {
      await this.mysqlDB
        .insertInto("UserNotification")
        .values({
          token: token,
          userId: userId
        })
        .execute()
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    } else {
      await this.mysqlDB
        .updateTable("UserNotification")
        .set({
          token: token
        })
        .where("userId", "=", userId)
        .execute()
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    }

    return {};
  };

  unregisterToken = async (token: string) => {
    console.log(
      `unregisterToken receive request ${JSON.stringify({
        token: token
      })}`
    );

    await this.mysqlDB
      .updateTable("UserNotification")
      .set({
        token: null
      })
      .where("token", "=", token)
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };

  startJobUnregisterErrorTokens = () => {
    console.log("[NOTI SERVICE] Start startJobUnregisterErrorTokens");
    cron.schedule("0,5,10,15,20,25,30,35,40,45,50,55 * * * * *", () => {
      const errorTokens = this.expoNotification.popErrorTokens();
      errorTokens.forEach((token) => {
        void this.unregisterToken(token);
      });
    });
  };

  pushNoti = async (
    title: string,
    content: string,
    route: string,
    photoUrl: string,
    userId: string,
    topic: NotificationTopics
  ) => {
    console.log(
      `pushNoti receive request ${JSON.stringify({
        title: title,
        content: content,
        route: route,
        photoUrl: photoUrl,
        userId: userId,
        topic: topic
      })}`
    );

    const userNotification = await this.getUserNotification(userId);

    if (!userNotification) return;
    if (!this.expoNotification.isExpoPushToken(userNotification.token)) return;
    if (userNotification.disabledTopics.includes(topic.toString())) return;

    userNotification.token &&
      this.expoNotification.pushMessage(
        userNotification.token,
        content,
        { route: route },
        title
      );
  };

  getUserNotification = async (
    userId: string
  ): Promise<{
    token: string | null;
    disabledTopics: string[];
  } | null> => {
    console.log(
      `getUserNotification receive request ${JSON.stringify({
        userId: userId
      })}`
    );

    const userNotification = await this.mysqlDB
      .selectFrom("UserNotification")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (!userNotification) return null;

    const disabledTopics = <string[]>(
      JSON.parse(userNotification.disabledTopics ?? "[]")
    );

    console.log("UserId", userId, "has disabledTopics =", disabledTopics);

    return { token: userNotification.token, disabledTopics: disabledTopics };
  };

  updateDisabledTopics = async (disabledTopics: string[], userId: string) => {
    console.log(
      `updateUserNotification receive request ${JSON.stringify({
        disabledTopics: disabledTopics,
        userId: userId
      })}`
    );

    const userNotification = await this.getUserNotification(userId);

    if (userNotification != null) {
      void this.mysqlDB
        .updateTable("UserNotification")
        .set({
          disabledTopics: JSON.stringify(disabledTopics)
        })
        .where("userId", "=", userId)
        .execute()
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    } else {
      void this.mysqlDB
        .insertInto("UserNotification")
        .values({
          disabledTopics: JSON.stringify(disabledTopics),
          userId: userId
        })
        .execute()
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    }
  };
}

export default NotiService;
export { NotificationTopics };
