import { z } from "zod";

const PickupLetterStatus = z.enum(["NotConfirmed", "Confirmed", "Rejected"]);

const Pickup = z.object({
  id: z.string(),
  time: z.nullable(z.date()),
  status: z.nullable(PickupLetterStatus),
  pickerFullname: z.nullable(z.string()),
  studentFullname: z.nullable(z.string())
});

const GetPickupListRequest = z.object({
  timeStart: z.date(),
  timeEnd: z.date(),
  studentId: z.string()
});

const GetPickupListResponse = z.object({
  pickups: z.array(Pickup)
});

const GetPickupDetailRequest = z.object({
  id: z.string()
});

const PickupDetail = z.object({
  id: z.string(),
  note: z.nullable(z.string()),
  time: z.nullable(z.date()),
  status: z.nullable(PickupLetterStatus),
  createdAt: z.nullable(z.date()),
  studentFullname: z.nullable(z.string()),
  teacherFullname: z.nullable(z.string()),
  pickerFullname: z.nullable(z.string())
});

const GetPickupDetailResponse = z.object({
  pickup: z.nullable(PickupDetail)
});

const Relative = z.object({
  id: z.string(),
  fullname: z.string(),
  phone: z.string(),
  avatar: z.nullable(z.string()),
  avatarUrl: z.nullable(z.string())
});

const GetRelativeListRequest = z.object({});

const GetRelativeListResponse = z.object({
  relatives: z.nullable(z.array(Relative))
});

const InsertRelativeRequest = z.object({
  fullname: z.string(),
  note: z.string(),
  phone: z.string(),
  avatarData: z.string()
});

const InsertRelativeResponse = z.object({});

const InsertPickupLetterRequest = z.object({
  pickerId: z.string(),
  date: z.date(),
  studentId: z.string(),
  note: z.string()
});

const InsertPickupLetterResponse = z.object({});

const GetPickupListFromClassIdRequest = z.object({
  time: z.date(),
  classId: z.string()
});

const GetPickupListFromClassIdResponse = z.object({
  pickups: z.array(Pickup)
});

const ConfirmPickupLetterRequest = z.object({
  id: z.string()
});

const ConfirmPickupLetterResponse = z.object({});

const RejectPickupLetterRequest = z.object({
  id: z.string()
});

const RejectPickupLetterResponse = z.object({});
export { PickupLetterStatus };

export { GetPickupDetailRequest, GetPickupDetailResponse };

export { GetPickupListRequest, GetPickupListResponse };

export { GetRelativeListRequest, GetRelativeListResponse };

export { InsertRelativeRequest, InsertRelativeResponse };

export { InsertPickupLetterResponse, InsertPickupLetterRequest };

export { GetPickupListFromClassIdRequest, GetPickupListFromClassIdResponse };

export { ConfirmPickupLetterRequest, ConfirmPickupLetterResponse };

export { RejectPickupLetterRequest, RejectPickupLetterResponse };
