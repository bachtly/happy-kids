import { attendanceRouter } from "./router/attendance/attendance-router";
import { authRouter } from "./router/authentication/auth-router";
import { medicineRouter } from "./router/medicine/medicine-router";
import { createTRPCRouter } from "./trpc";
export const appRouter = createTRPCRouter({
  auth: authRouter,
  attendance: attendanceRouter,
  medicine: medicineRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
