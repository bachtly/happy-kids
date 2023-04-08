interface PeriodRemarkModel {
  id: string | null;
  period: string | null;
  content: string | null;
  startTime: Date | null;
  teacherFullname?: string | null;
  teacherAvatar?: string | null;
  studentFullname?: string | null;
  studentAvatar?: string | null;
  studentId?: string | null;
}

export type { PeriodRemarkModel };
