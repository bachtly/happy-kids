import { z } from "zod";

const ResponseStatus = z.enum(["Success", "Fail"]);

const LetterStatus = z.enum(["Confirmed", "NotConfirmed", "Rejected"]);

const LeaveLetter = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string(),
  createdAt: z.date(),
  status: LetterStatus,
  updatedByTeacher: z.string().nullable().default(null),
  createdByParent: z.string().nullable().default(null),
  photos: z.array(z.string()).default([]),
  studentName: z.string().default("")
});

const PostLeaveLetterParams = z.object({
  startDate: z.date(),
  endDate: z.date(),

  photos: z.array(z.string()).default([]),
  reason: z.string(),

  studentId: z.string(),
  parentId: z.string()
});

const PostLeaveLetterResponse = z.object({
  status: ResponseStatus,
  message: z.string(),
  leaveLetterId: z.string()
});

const UpdateStatusLeaveLetterParams = z.object({
  teacherId: z.string(),
  leaveLetterId: z.string(),
  status: LetterStatus
});

const UpdateStatusLeaveLetterResponse = z.object({
  status: ResponseStatus,
  message: z.string()
});

const GetLeaveLetterListParams = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional()
});

const GetLeaveLetterListResponse = z.object({
  status: ResponseStatus,
  message: z.string(),
  leaveLetterList: z.array(LeaveLetter)
});

const GetLeaveLetterParams = z.object({
  leaveLetterId: z.string()
});

const GetLeaveLetterResponse = z.object({
  status: ResponseStatus,
  message: z.string(),
  leaveLetter: LeaveLetter.nullable()
});

export {
  LeaveLetter,
  PostLeaveLetterParams,
  PostLeaveLetterResponse,
  UpdateStatusLeaveLetterParams,
  UpdateStatusLeaveLetterResponse,
  GetLeaveLetterListParams,
  GetLeaveLetterListResponse,
  GetLeaveLetterParams,
  GetLeaveLetterResponse,
  ResponseStatus,
  LetterStatus
};
