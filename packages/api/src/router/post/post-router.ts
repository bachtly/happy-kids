import { createTRPCRouter, protectedProcedure } from "../../trpc";
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
  getPostList: protectedProcedure
    .input(GetPostListRequest)
    .output(GetPostListResponse)
    .mutation(
      async ({ ctx, input }) =>
        await postService.getPostList(
          ctx.session.user.id,
          input.page,
          input.itemsPerPage
        )
    ),

  getUserInfo: protectedProcedure
    .input(GetUserInfoRequest)
    .output(GetUserInfoResponse)
    .mutation(
      async ({ ctx }) => await postService.getUserInfo(ctx.session.user.id)
    ),

  insertPost: protectedProcedure
    .input(InsertPostRequest)
    .output(InsertPostResponse)
    .mutation(
      async ({ ctx, input }) =>
        await postService.insertPost(
          input.content,
          input.photos,
          ctx.session.user.id
        )
    ),

  getCommentList: protectedProcedure
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

  comment: protectedProcedure
    .input(CommentRequest)
    .output(CommentResponse)
    .mutation(
      async ({ ctx, input }) =>
        await postService.comment(
          input.content,
          ctx.session.user.id,
          input.postId
        )
    )
});

export { postRouter };
