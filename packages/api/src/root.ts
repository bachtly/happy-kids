import { attendanceRouter } from "./router/attendance/attendance-router";
import { authRouter } from "./router/authentication/auth-router";
import { leaveletterRouter } from "./router/leaveletter/leaveletter-router";
import { medicineRouter } from "./router/medicine/medicine-router";
import { createTRPCRouter } from "./trpc";
import { pickupRouter } from "./router/pickup/pickup-router";
import { dailyRemarkRouter } from "./router/remark/daily-remark-router";
import { periodRemarkRouter } from "./router/remark/period-remark-router";
import { noteRouter } from "./router/note/note-router";
import { postRouter } from "./router/post/post-router";
import { accountRouter } from "./router/account/account-router";
import { notiRouter } from "./router/noti/noti-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  attendance: attendanceRouter,
  medicine: medicineRouter,
  leaveletter: leaveletterRouter,
  pickup: pickupRouter,
  dailyRemark: dailyRemarkRouter,
  periodRemark: periodRemarkRouter,
  note: noteRouter,
  post: postRouter,
  account: accountRouter,
  post: postRouter,
  noti: notiRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
