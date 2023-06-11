import { z } from "zod";

const ThreadStatus = z.enum(["Confirmed", "NotConfirmed", "Rejected"]);

const NoteMessage = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.date(),

  userId: z.string().default(""),
  user: z.string().default("")
});

const PostNoteThreadParams = z.object({
  startDate: z.date(),
  endDate: z.date(),

  content: z.string(),
  photos: z.array(z.string()).default([]),

  studentId: z.string(),
  classId: z.string()
});

const PostNoteThreadResponse = z.object({
  noteThreadId: z.string()
});

const PostNoteMessageParams = z.object({
  message: NoteMessage,
  noteThreadId: z.string(),
  studentId: z.string().nullable()
});

const UpdateStatusNoteThreadParams = z.object({
  noteThreadId: z.string(),
  status: ThreadStatus
});

const GetNoteThreadListParams = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional()
});

const GetNoteThreadParams = z.object({
  noteThreadId: z.string()
});

export {
  PostNoteThreadParams,
  PostNoteThreadResponse,
  PostNoteMessageParams,
  UpdateStatusNoteThreadParams,
  GetNoteThreadListParams,
  GetNoteThreadParams,
  ThreadStatus,
  NoteMessage
};
