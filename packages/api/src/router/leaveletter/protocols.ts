import { z } from "zod";

const LetterStatus = z.enum(["Confirmed", "NotConfirmed", "Rejected"]);

const PostLeaveLetterParams = z.object({
  startDate: z.date(),
  endDate: z.date(),

  photos: z.array(z.string()).default([]),
  reason: z.string(),

  studentId: z.string(),
  classId: z.string()
});

const UpdateStatusLeaveLetterParams = z.object({
  leaveLetterId: z.string(),
  status: LetterStatus
});

const GetLeaveLetterListParams = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional()
});

const GetLeaveLetterParams = z.object({
  leaveLetterId: z.string()
});

export {
  PostLeaveLetterParams,
  UpdateStatusLeaveLetterParams,
  GetLeaveLetterListParams,
  GetLeaveLetterParams,
  LetterStatus
};
