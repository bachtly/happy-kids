import { z } from "zod";

const ThreadStatus = z.enum(["Confirmed", "NotConfirmed", "Rejected"]);

const NoteMessage = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.date(),

  userId: z.string().default(""),
  user: z.string().default("")
});

const NoteThread = z.object({
  id: z.string(),
  createdAt: z.date(),
  startDate: z.date(),
  endDate: z.date(),

  status: ThreadStatus,
  content: z.string(),
  photos: z.array(z.string()).default([]),

  messages: z.array(NoteMessage).default([]),

  createdByParent: z.string().nullable().default(null),
  studentName: z.string().default("")
});

const PostNoteThreadParams = z.object({
  startDate: z.date(),
  endDate: z.date(),

  content: z.string(),
  photos: z.array(z.string()).default([]),

  studentId: z.string()
});

const PostNoteThreadResponse = z.object({
  noteThreadId: z.string()
});

const PostNoteMessageParams = z.object({
  message: NoteMessage,
  noteThreadId: z.string()
});

const PostNoteMessageResponse = z.object({});

const UpdateStatusNoteThreadParams = z.object({
  noteThreadId: z.string(),
  status: ThreadStatus
});

const GetNoteThreadListParams = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional()
});

const GetNoteThreadListResponse = z.object({
  noteThreadList: z.array(NoteThread)
});

const GetNoteThreadParams = z.object({
  noteThreadId: z.string()
});

const GetNoteThreadResponse = z.object({
  noteThread: NoteThread.nullable()
});

export {
  NoteThread,
  PostNoteThreadParams,
  PostNoteThreadResponse,
  PostNoteMessageParams,
  PostNoteMessageResponse,
  UpdateStatusNoteThreadParams,
  GetNoteThreadListParams,
  GetNoteThreadListResponse,
  GetNoteThreadParams,
  GetNoteThreadResponse,
  ThreadStatus,
  NoteMessage
};
