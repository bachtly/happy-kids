type MedicineLetterStatus = "NotConfirmed" | "Confirmed" | "Rejected";
type MedicineLetterUseStatus = "NotUsed" | "Used";

interface MedicineModel {
  name: string;
  amount: string;
  photo: string;
}

interface MedLetterItem {
  id: string;
  note: string;
  status: MedicineLetterStatus;
  createdAt: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  studentName: string;
}

interface MedUseTime {
  status: MedicineLetterUseStatus;
  date: Date;
  note: string;
}

export type {
  MedicineModel,
  MedicineLetterStatus,
  MedLetterItem,
  MedUseTime,
  MedicineLetterUseStatus
};
