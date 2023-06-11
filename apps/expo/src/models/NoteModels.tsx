type NoteThreadStatus = "NotConfirmed" | "Confirmed" | "Rejected";

interface NoteThread {
  id: string;
  studentName: string;
  status: NoteThreadStatus;
  content: string;

  createdAt: Date | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface NoteMessage {
  id: string;
  content: string;
  sendTime: Date;
  sendUser: string;
  sendUserId: string;
}

export type { NoteThread, NoteThreadStatus, NoteMessage };
