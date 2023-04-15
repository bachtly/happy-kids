import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  CommentRequest,
  CommentResponse,
  GetCommentListRequest,
  GetCommentListResponse,
  GetPostListRequest,
  GetPostListResponse,
  GetUserInfoRequest,
  GetUserInfoResponse,
  InsertPostRequest,
  InsertPostResponse
} from "./post-protocols";
import { postService } from "../../service/common-services";

const postRouter = createTRPCRouter({
  getPostList: publicProcedure
    .input(GetPostListRequest)
    .output(GetPostListResponse)
    .mutation(
      async ({ input }) =>
        await postService.getPostList(
          input.userId,
          input.page,
          input.itemsPerPage
        )
    ),

  getUserInfo: publicProcedure
    .input(GetUserInfoRequest)
    .output(GetUserInfoResponse)
    .mutation(async ({ input }) => await postService.getUserInfo(input.userId)),

  insertPost: publicProcedure
    .input(InsertPostRequest)
    .output(InsertPostResponse)
    .mutation(
      async ({ input }) =>
        await postService.insertPost(input.content, input.photos, input.userId)
    ),

  getCommentList: publicProcedure
    .input(GetCommentListRequest)
    .output(GetCommentListResponse)
    .mutation(
      async ({ input }) =>
        await postService.getCommentList(
          input.postId,
          input.page,
          input.itemsPerPage
        )
    ),

  comment: publicProcedure
    .input(CommentRequest)
    .output(CommentResponse)
    .mutation(
      async ({ input }) =>
        await postService.comment(input.content, input.userId, input.postId)
    )
});

export { postRouter };
