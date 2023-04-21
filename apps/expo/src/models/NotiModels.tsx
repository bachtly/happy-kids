interface NotiItemModel {
  id: string;
  title?: string | null;
  content?: string | null;
  route?: string | null;
  photo?: string | null;
  time?: Date | null;
}

export type { NotiItemModel };
