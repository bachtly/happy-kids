import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import { inject, injectable } from "tsyringe";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";
import { v4 as uuidv4 } from "uuid";
import AccountService from "./account-service";

@injectable()
class AlbumService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private accountService: AccountService,
    @inject("PhotoService") private photoService: PhotoServiceInterface
  ) {}

  getAlbumListByClass = async (classId: string) => {
    const albums = await Promise.all(
      await this.mysqlDB
        .selectFrom("Album")
        .innerJoin("Class", "Album.classId", "Class.id")
        .leftJoin(
          "AlbumTopicRelationship",
          "Album.id",
          "AlbumTopicRelationship.albumId"
        )
        .leftJoin(
          "AlbumTopic",
          "AlbumTopicRelationship.topicId",
          "AlbumTopic.id"
        )
        .select([
          "Album.id",
          "Album.title",
          "Album.description",
          "Album.createdAt",
          "Album.photos",
          "Album.eventDate",
          "AlbumTopic.topic",
          "AlbumTopic.id as topicId",
          "Album.teacherId"
        ])
        .where("Album.classId", "=", classId)
        .execute()
        .then(async (resp) => {
          type albumType = Omit<
            (typeof resp)[number],
            "topic" | "photos" | "topicId" | "teacherId"
          > & {
            topics: { topic: string; id: string }[];
            photos: string[];
            numPhoto: number;
            teacher: {
              name: string;
              avatar: string;
            };
          };

          const m = new Map<string, albumType>();

          for (const item of resp) {
            const album = m.get(item.id);
            if (!album) {
              const photoPaths = item.photos
                ? <string[]>JSON.parse(item.photos)
                : [];
              const photos = await Promise.all(
                photoPaths
                  .slice(0, 3)
                  .map((photoPath) =>
                    this.photoService.getPhotoFromPath(photoPath)
                  )
              );

              const getAcc = await this.accountService.getAccountInfo(
                item.teacherId ?? ""
              );
              m.set(item.id, {
                id: item.id,
                title: item.title,
                createdAt: item.createdAt,
                description: item.description,
                eventDate: item.eventDate,
                photos: photos,
                topics: item.topicId
                  ? [{ id: item.topicId, topic: item.topic ?? "" }]
                  : [],
                numPhoto: photoPaths.length,
                teacher: {
                  name: getAcc.res.fullname,
                  avatar: getAcc.res.avatar
                }
              });
            } else {
              if (item.topic && item.topicId)
                album.topics.push({ id: item.topicId, topic: item.topic });
            }
          }

          return Array.from(m.values());
        })
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );

    return {
      albums: albums
    };
  };

  getAlbumListByStudent = async (studentId: string) => {
    const albums = await Promise.all(
      await this.mysqlDB
        .selectFrom("Student")
        .innerJoin(
          "StudentClassRelationship",
          "Student.id",
          "StudentClassRelationship.studentId"
        )
        .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
        .innerJoin("Album", "Album.classId", "Class.id")
        .leftJoin(
          "AlbumTopicRelationship",
          "Album.id",
          "AlbumTopicRelationship.albumId"
        )
        .leftJoin(
          "AlbumTopic",
          "AlbumTopicRelationship.topicId",
          "AlbumTopic.id"
        )
        .leftJoin("User", "User.id", "Album.teacherId")
        .select([
          "Album.id",
          "Album.title",
          "Album.description",
          "Album.createdAt",
          "Album.eventDate",
          "Album.photos",
          "AlbumTopic.topic",
          "AlbumTopic.id as topicId",
          "Album.teacherId"
        ])
        .where("Student.id", "=", studentId)
        .execute()
        .then(async (resp) => {
          type albumType = Omit<
            (typeof resp)[number],
            "topic" | "photos" | "topicId" | "teacherId"
          > & {
            topics: { topic: string; id: string }[];
            photos: string[];
            numPhoto: number;
            teacher: {
              name: string;
              avatar: string;
            };
          };

          const m = new Map<string, albumType>();

          for (const item of resp) {
            const album = m.get(item.id);
            if (!album) {
              const photoPaths = item.photos
                ? <string[]>JSON.parse(item.photos)
                : [];
              const photos = await Promise.all(
                photoPaths
                  .slice(0, 3)
                  .map((photoPath) =>
                    this.photoService.getPhotoFromPath(photoPath)
                  )
              );

              const getAcc = item.teacherId
                ? await this.accountService.getAccountInfo(item.teacherId)
                : null;

              m.set(item.id, {
                id: item.id,
                title: item.title,
                createdAt: item.createdAt,
                description: item.description,
                eventDate: item.eventDate,
                photos: photos,
                topics: item.topicId
                  ? [{ id: item.topicId, topic: item.topic ?? "" }]
                  : [],
                numPhoto: photoPaths.length,
                teacher: {
                  name: getAcc?.res.fullname ?? "TeacherName",
                  avatar: getAcc?.res.avatar ?? ""
                }
              });
            } else {
              if (item.topic && item.topicId)
                album.topics.push({ id: item.topicId, topic: item.topic });
            }
          }

          return Array.from(m.values());
        })
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );

    return {
      albums: albums
    };
  };

  getAlbum = async (albumId: string) => {
    return this.mysqlDB
      .selectFrom("Album")
      .innerJoin("Class", "Album.classId", "Class.id")
      .leftJoin(
        "AlbumTopicRelationship",
        "Album.id",
        "AlbumTopicRelationship.albumId"
      )
      .leftJoin("AlbumTopic", "AlbumTopicRelationship.topicId", "AlbumTopic.id")
      .select([
        "Album.id",
        "Album.title",
        "Album.description",
        "Album.photos",
        "Album.eventDate",
        "AlbumTopic.topic as topics",
        "Album.teacherId"
      ])
      .where("Album.id", "=", albumId)
      .execute()
      .then(async (resp) => {
        if (resp.length == 0) throw new Error("Not exist albumId");
        const f = resp[0];
        const photoPaths = f.photos ? <string[]>JSON.parse(f.photos) : [];
        const photos = await Promise.all(
          photoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );
        const topics = resp.map((item) => item.topics);
        const getAcc = f.teacherId
          ? await this.accountService.getAccountInfo(f.teacherId)
          : null;

        return {
          ...f,
          topics: topics,
          photos: photos,
          teacher: {
            name: getAcc?.res.fullname ?? "TeacherName",
            avatar: getAcc?.res.avatar ?? ""
          }
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
  };

  insertAlbum = async (
    title: string,
    description: string,
    photos: string[],
    classId: string,
    eventDate: Date,
    topics: string[],
    userId: string
  ) => {
    if (photos.length === 0) throw "Vui lòng thêm ảnh";
    const photoPaths = photos
      .filter((item) => item != "")
      .map((item) => {
        return this.photoService.storePhoto(item, "./album");
      });

    const albumId = uuidv4();
    const count = await this.mysqlDB
      .insertInto("Album")
      .values({
        id: albumId,
        title: title,
        description: description,
        photos: JSON.stringify(photoPaths),
        createdAt: new Date(),
        classId: classId,
        eventDate,
        teacherId: userId
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (!count || count <= 0) throw SYSTEM_ERROR_MESSAGE;
    if (topics.length > 0)
      await this.mysqlDB
        .insertInto("AlbumTopicRelationship")
        .values(
          topics.map((topicId) => ({
            albumId,
            topicId
          }))
        )
        .execute()
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        });
    return {};
  };

  insertAlbumTopic = async (topic: string) => {
    const id = uuidv4();
    const count = await this.mysqlDB
      .insertInto("AlbumTopic")
      .values({
        id,
        topic
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (!count || count <= 0) throw SYSTEM_ERROR_MESSAGE;
    return { albumTopicId: id };
  };

  getAlbumTopic = async () => {
    const topics = await this.mysqlDB
      .selectFrom("AlbumTopic")
      .selectAll()
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
    return topics;
  };
}

export default AlbumService;
