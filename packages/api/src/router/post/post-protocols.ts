import { z } from "zod";

const GetPostListRequest = z.object({
  userId: z.string(),
  page: z.number(),
  itemsPerPage: z.number()
});

const Post = z.object({
  id: z.string(),
  createdAt: z.nullable(z.date()),
  content: z.nullable(z.string()),
  photos: z.nullable(z.array(z.string())),
  userFullname: z.nullable(z.string()),
  userAvatar: z.nullable(z.string())
});

const GetPostListResponse = z.object({
  posts: z.array(Post),
  hasNextPage: z.boolean(),
  message: z.nullable(z.string())
});

export { GetPostListResponse, GetPostListRequest };

const CommentRequest = z.object({
  content: z.string(),
  userId: z.string(),
  postId: z.string()
});

const CommentResponse = z.object({
  message: z.nullable(z.string())
});

export { CommentRequest, CommentResponse };

// const ReactRequest = z.object({
//   reaction: z.string(),
//   userId: z.string(),
//   postId: z.string()
// });
//
// const ReactResponse = z.object({
//   message: z.nullable(z.string())
// });
//
// export { ReactRequest, ReactResponse };

const User = z.object({
  id: z.string(),
  fullname: z.nullable(z.string()),
  avatar: z.nullable(z.string())
});

const GetUserInfoRequest = z.object({
  userId: z.string()
});

const GetUserInfoResponse = z.object({
  user: User,
  message: z.nullable(z.string())
});

export { GetUserInfoRequest, GetUserInfoResponse };

const InsertPostRequest = z.object({
  content: z.string(),
  photos: z.array(z.string()),
  userId: z.string()
});

const InsertPostResponse = z.object({
  message: z.nullable(z.string())
});

export { InsertPostResponse, InsertPostRequest };

const Comment = z.object({
  id: z.string(),
  time: z.nullable(z.date()),
  content: z.nullable(z.string()),
  userFullname: z.nullable(z.string()),
  userAvatar: z.nullable(z.string())
});

const GetCommentListRequest = z.object({
  postId: z.string(),
  page: z.number(),
  itemsPerPage: z.number()
});

const GetCommentListResponse = z.object({
  comments: z.array(Comment),
  hasNextPage: z.boolean(),
  message: z.nullable(z.string())
});

export { Comment, GetCommentListRequest, GetCommentListResponse };
