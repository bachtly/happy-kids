import { z } from "zod";

const LetterStatus = z.enum(["NotConfirmed", "Confirmed", "Rejected"]);

const Pickup = z.object({
  id: z.string(),
  time: z.nullable(z.date()),
  status: z.nullable(LetterStatus),
  pickerFullname: z.nullable(z.string()),
  studentFullname: z.nullable(z.string())
});

const GetPickupListRequest = z.object({
  timeStart: z.date(),
  timeEnd: z.date(),
  studentId: z.string()
});

const GetPickupListResponse = z.object({
  pickups: z.array(Pickup),
  message: z.nullable(z.string())
});

const GetPickupDetailRequest = z.object({
  id: z.string()
});

const PickupDetail = z.object({
  id: z.string(),
  note: z.nullable(z.string()),
  time: z.nullable(z.date()),
  status: z.nullable(LetterStatus),
  createdAt: z.nullable(z.date()),
  teacherFullname: z.nullable(z.string()),
  pickerFullname: z.nullable(z.string())
});

const GetPickupDetailResponse = z.object({
  pickup: z.nullable(PickupDetail),
  message: z.nullable(z.string())
});

const Relative = z.object({
  id: z.string(),
  fullname: z.string(),
  phone: z.string(),
  avatar: z.nullable(z.string()),
  avatarUrl: z.nullable(z.string())
});

const GetRelativeListRequest = z.object({
  parentId: z.string()
});

const GetRelativeListResponse = z.object({
  relatives: z.nullable(z.array(Relative)),
  message: z.nullable(z.string())
});

const InsertRelativeRequest = z.object({
  fullname: z.string(),
  note: z.string(),
  phone: z.string(),
  avatarData: z.string(),
  parentId: z.string()
});

const InsertRelativeResponse = z.object({
  message: z.nullable(z.string())
});

const InsertPickupLetterRequest = z.object({
  pickerId: z.string(),
  date: z.date(),
  studentId: z.string(),
  note: z.string()
});

const InsertPickupLetterResponse = z.object({
  message: z.nullable(z.string())
});

const GetPickupListFromClassIdRequest = z.object({
  time: z.date(),
  classId: z.string()
});

const GetPickupListFromClassIdResponse = z.object({
  pickups: z.array(Pickup),
  message: z.nullable(z.string())
});

const ConfirmPickupLetterRequest = z.object({
  id: z.string(),
  teacherId: z.string()
});

const ConfirmPickupLetterResponse = z.object({
  message: z.nullable(z.string())
});

const RejectPickupLetterRequest = z.object({
  id: z.string(),
  teacherId: z.string()
});

const RejectPickupLetterResponse = z.object({
  message: z.nullable(z.string())
});

export { GetPickupDetailRequest, GetPickupDetailResponse };

export { GetPickupListRequest, GetPickupListResponse };

export { GetRelativeListRequest, GetRelativeListResponse };

export { InsertRelativeRequest, InsertRelativeResponse };

export { InsertPickupLetterResponse, InsertPickupLetterRequest };

export { GetPickupListFromClassIdRequest, GetPickupListFromClassIdResponse };

export { ConfirmPickupLetterRequest, ConfirmPickupLetterResponse };

export { RejectPickupLetterRequest, RejectPickupLetterResponse };
