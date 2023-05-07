import { z } from "zod";

const LetterStatus = z.enum(["Confirmed", "NotConfirmed", "Rejected"]);
const MedicineStatus = z.enum(["NotUsed", "Used"]);

const MedicineUseTime = z.object({
  status: MedicineStatus,
  note: z.string(),
  date: z.date()
});

const Medicine = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.string(),
  photo: z.string(),
  time: z.number(),
  batchNumber: z.number()
});

const MedicineLetter = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: LetterStatus,
  note: z.string(),
  createdAt: z.date(),

  updatedByTeacher: z.string().nullable().default(null),
  createdByParent: z.string().nullable().default(null),
  studentName: z.string().default(""),
  medicines: z.array(Medicine).default([]),
  batchList: z.array(z.number()).default([]),
  useDiary: z.array(MedicineUseTime).default([])
});

const PostMedicineLetterParams = z.object({
  startDate: z.date(),
  endDate: z.date(),

  medicines: z.array(Medicine),
  note: z.string(),

  studentId: z.string()
});

const PostMedicineLetterResponse = z.object({
  medicineLetterId: z.string()
});

const GetMedicineLetterParams = z.object({
  medicineLetterId: z.string()
});

const GetMedicineLetterResponse = z.object({
  medicineLetter: MedicineLetter.optional()
});

const UpdateStatusMedicineLetterParams = z.object({
  teacherId: z.string(),
  medicineLetterId: z.string(),
  status: LetterStatus.optional(),
  useDiary: z.array(MedicineUseTime).optional()
});

const UpdateStatusMedicineLetterResponse = z.object({});

const GetMedicineLetterListParams = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional()
});

const GetMedicineLetterListResponse = z.object({
  medicineLetterList: z.array(MedicineLetter)
});

export {
  Medicine,
  MedicineLetter,
  PostMedicineLetterParams,
  PostMedicineLetterResponse,
  GetMedicineLetterListParams,
  GetMedicineLetterListResponse,
  GetMedicineLetterParams,
  GetMedicineLetterResponse,
  UpdateStatusMedicineLetterParams,
  UpdateStatusMedicineLetterResponse,
  MedicineUseTime,
  LetterStatus
};
