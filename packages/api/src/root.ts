import { attendanceRouter } from "./router/attendance/attendance-router";
import { authRouter } from "./router/authentication/auth-router";
import { leaveletterRouter } from "./router/leaveletter/leaveletter-router";
import { medicineRouter } from "./router/medicine/medicine-router";
import { createTRPCRouter } from "./trpc";
import { pickupRouter } from "./router/pickup/pickup-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  attendance: attendanceRouter,
  medicine: medicineRouter,
  leaveletter: leaveletterRouter,
  pickup: pickupRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
