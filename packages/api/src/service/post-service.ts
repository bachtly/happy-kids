import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import type { PhotoServiceInterface } from "../utils/PhotoService";
import { inject, injectable } from "tsyringe";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import type { FileServiceInterface } from "../utils/FileService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";

@injectable()
class PostService {
  constructor(
    private mysqlDB: Kysely<DB>,
    @inject("FileService") private fileService: FileServiceInterface,
    @inject("PhotoService") private photoService: PhotoServiceInterface
  ) {}

  getPostList = async (userId: string, page: number, itemsPerPage: number) => {
    console.log(
      `getPostList receive request ${JSON.stringify({
        userId: userId,
        page: page,
        itemsPerPage: itemsPerPage
      })}`
    );

    const posts = await Promise.all(
      await this.mysqlDB
        .selectFrom("Post")
        .innerJoin("User", "Post.userId", "User.id")
        .select([
          "Post.id",
          "Post.createdAt",
          "Post.content",
          "Post.photos",
          "User.fullname as userFullname",
          "User.avatarUrl as userAvatarUrl"
        ])
        .limit(itemsPerPage)
        .offset(itemsPerPage * page)
        .execute()
        .then((resp) =>
          resp.flat().map(async (item) => {
            const photoPaths = item.photos
              ? <string[]>JSON.parse(item.photos)
              : [];
            const photos = await Promise.all(
              photoPaths.map((photoPath) =>
                this.photoService.getPhotoFromPath(photoPath)
              )
            );

            const userAvatar = await this.photoService.getPhotoFromPath(
              item.userAvatarUrl ?? ""
            );

            return {
              ...item,
              photos: photos,
              userAvatar: userAvatar
            };
          })
        )
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );

    return {
      posts: posts,
      hasNextPage: posts.length == itemsPerPage
    };
  };

  insertPost = async (content: string, photos: string[], userId: string) => {
    console.log(
      `insertPost receive request ${JSON.stringify({
        content: content,
        photos: photos,
        userId: userId
      })}`
    );

    if (content.trim() === "") throw "Vui lòng nhập nội dung bài viết";

    const photoPaths = photos
      .filter((item) => item != "")
      .map((item) => {
        const filePath = "./post/" + uuidv4();
        void this.fileService.asyncWriteFile(filePath, item);
        return filePath;
      });

    const count = await this.mysqlDB
      .insertInto("Post")
      .values({
        createdAt: moment(moment.now()).toDate(),
        content: content,
        photos: JSON.stringify(photoPaths),
        userId: userId
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

  comment = async (content: string, userId: string, postId: string) => {
    console.log(
      `comment receive request ${JSON.stringify({
        content: content,
        userId: userId,
        postId: postId
      })}`
    );

    if (content.trim() == "") throw "Vui lòng nhập nội dung bình luận";

    const count = await this.mysqlDB
      .insertInto("PostComment")
      .values({
        content: content,
        userId: userId,
        postId: postId,
        time: moment().toDate()
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

  react = async (reaction: string, userId: string, postId: string) => {
    console.log(
      `comment receive request ${JSON.stringify({
        reaction: reaction,
        userId: userId,
        postId: postId
      })}`
    );

    const count = await this.mysqlDB
      .insertInto("PostReaction")
      .values({
        reaction: reaction,
        userId: userId,
        postId: postId
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

  getUserInfo = async (userId: string) => {
    console.log(
      `getUserInfo receive request ${JSON.stringify({
        userId: userId
      })}`
    );

    const user = await this.mysqlDB
      .selectFrom("User")
      .select(["User.id", "User.fullname", "User.avatarUrl"])
      .where("User.id", "=", userId)
      .executeTakeFirstOrThrow()
      .then(async (resp) => {
        return {
          avatar: await this.photoService.getPhotoFromPath(
            resp.avatarUrl ?? ""
          ),
          ...resp
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {
      user: user
    };
  };

  getCommentList = async (
    postId: string,
    page: number,
    itemsPerPage: number
  ) => {
    console.log(
      `getCommentList receive request ${JSON.stringify({
        postId: postId,
        page: page,
        itemsPerPage: itemsPerPage
      })}`
    );

    const comments = await Promise.all(
      await this.mysqlDB
        .selectFrom("PostComment")
        .innerJoin("User", "PostComment.userId", "User.id")
        .select([
          "PostComment.id",
          "PostComment.time",
          "PostComment.content",
          "User.fullname as userFullname",
          "User.avatarUrl as userAvatarUrl"
        ])
        .where("PostComment.postId", "=", postId)
        .limit(itemsPerPage)
        .offset(itemsPerPage * page)
        .execute()
        .then((resp) =>
          resp.flat().map(async (item) => {
            const userAvatar = await this.photoService.getPhotoFromPath(
              item.userAvatarUrl ?? ""
            );

            return {
              ...item,
              userAvatar: userAvatar
            };
          })
        )
        .catch((err: Error) => {
          console.log(err);
          throw SYSTEM_ERROR_MESSAGE;
        })
    );

    return {
      comments: comments,
      hasNextPage: comments.length == itemsPerPage
    };
  };
}

export { PostService };
