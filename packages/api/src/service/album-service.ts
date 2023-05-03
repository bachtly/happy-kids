import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import { inject, injectable } from "tsyringe";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";

@injectable()
class AlbumService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("PhotoService") private photoService: PhotoServiceInterface
  ) {}

  getAlbumListByClass = async (classId: string) => {
    const albums = await Promise.all(
      await this.mysqlDB
        .selectFrom("Album")
        .innerJoin("Class", "Album.classId", "Class.id")
        .select([
          "Album.id",
          "Album.title",
          "Album.description",
          "Album.createdAt",
          "Album.photos as photo"
        ])
        .where("Album.classId", "=", classId)
        .execute()
        .then((resp) =>
          resp.map(async (item) => {
            const photoPaths = item.photo
              ? <string[]>JSON.parse(item.photo)
              : [];
            const photo =
              photoPaths.length > 0
                ? await this.photoService.getPhotoFromPath(photoPaths[0])
                : "";

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
        .select([
          "Album.id",
          "Album.title",
          "Album.description",
          "Album.createdAt",
          "Album.photos as photo"
        ])
        .where("Student.id", "=", studentId)
        .execute()
        .then((resp) =>
          resp.map(async (item) => {
            const photoPaths = item.photo
              ? <string[]>JSON.parse(item.photo)
              : [];
            const photo =
              photoPaths.length > 0
                ? await this.photoService.getPhotoFromPath(photoPaths[0])
                : "";

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
      albums: albums
    };
  };

  getAlbum = async (albumId: string) => {
    return this.mysqlDB
      .selectFrom("Album")
      .innerJoin("Class", "Album.classId", "Class.id")
      .select(["Album.title", "Album.description", "Album.photos"])
      .where("Album.id", "=", albumId)
      .executeTakeFirstOrThrow()
      .then(async (resp) => {
        const photoPaths = resp.photos ? <string[]>JSON.parse(resp.photos) : [];
        const photos = await Promise.all(
          photoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );

        return {
          ...resp,
          photos: photos
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
    classId: string
  ) => {
    if (photos.length === 0) throw "Vui lòng thêm ảnh";
    const photoPaths = photos
      .filter((item) => item != "")
      .map((item) => {
        return this.photoService.storePhoto(item, "./album");
      });

    const count = await this.mysqlDB
      .insertInto("Album")
      .values({
        title: title,
        description: description,
        photos: JSON.stringify(photoPaths),
        createdAt: new Date(),
        classId: classId
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (!count || count <= 0) throw SYSTEM_ERROR_MESSAGE;

    return {};
  };
}

export default AlbumService;
