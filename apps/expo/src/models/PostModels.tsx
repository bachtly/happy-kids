interface PostItemModel {
  id?: string;
  content?: string | null;
  createdAt?: Date | null;
  photos?: string[] | null;
  userFullname?: string | null;
  userAvatar?: string | null;
}

interface PostUserModel {
  id?: string;
  fullname?: string | null;
  avatar?: string | null;
}

interface CommentModel {
  id?: string;
  time?: Date | null;
  content?: string | null;
  userFullname?: string | null;
  userAvatar?: string | null;
}

export type { PostItemModel, PostUserModel, CommentModel };
