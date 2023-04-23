import { inject, injectable } from "tsyringe";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import moment from "moment/moment";

@injectable()
class NotiService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("PhotoService") private photoService: PhotoServiceInterface
  ) {}

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
    );

    return {
      notis: notis,
      message: null
    };
  };

  insertNoti = async (
    title: string,
    content: string,
    route: string,
    photoUrl: string,
    userId: string
  ) => {
    console.log(
      `insertNoti receive request ${JSON.stringify({
        title: title,
        content: content,
        route: route,
        photoUrl: photoUrl,
        userId: userId
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
      .then((res) => res.numInsertedOrUpdatedRows);

    if (!count || count <= 0) return { message: "Insertion fail." };

    return {
      message: null
    };
  };
}

export default NotiService;
