interface NotiItemModel {
  id: string;
  title?: string | null;
  content?: string | null;
  route?: string | null;
  photo?: string | null;
  time?: Date | null;
}

enum NotificationTopics {
  Attendance = "Attendance",
  MedicineLetter = "MedicineLetter",
  LeaveLetter = "LeaveLetter",
  NoteLetter = "NoteLetter",
  PickupLetter = "PickupLetter",
  Post = "Post",
  Album = "Album"
}

interface NotificationSettingModel {
  disabledTopics: NotificationTopics[];
}

export type { NotiItemModel, NotificationSettingModel };
export { NotificationTopics };
