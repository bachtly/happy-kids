import { z } from "zod";

const GetAlbumListRequest = z.object({
  classId: z.string(),
  studentId: z.string()
});

export { GetAlbumListRequest };

const InsertAlbumRequest = z.object({
  title: z.string(),
  description: z.string(),
  photos: z.array(z.string()),
  classId: z.string(),
  eventDate: z.date(),
  topics: z.array(z.string())
});

export { InsertAlbumRequest };

const GetAlbumRequest = z.object({
  albumId: z.string()
});

export { GetAlbumRequest };

const InsertAlbumTopicRequest = z.object({
  topic: z.string()
});

export { InsertAlbumTopicRequest };
