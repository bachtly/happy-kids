interface UserChatModel {
  name: string;
  avatar: string;
}
interface AlbumItemModel {
  id: string;
  photos: string[];
  title: string;
  description: string;
  topics: AlbumTopic[];
  eventDate: Date;
  numPhoto: number;
  teacher: UserChatModel;
}
interface AlbumTopic {
  id: string;
  topic: string;
}

export type { AlbumItemModel, AlbumTopic, UserChatModel };
