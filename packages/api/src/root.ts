import { attendanceRouter } from "./router/attendance/attendance-router";
import { authRouter } from "./router/authentication/auth-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  attendance: attendanceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
