import { createTRPCRouter } from "./trpc";
import { authRouter } from "./router/authentication/auth-router";

export const appRouter = createTRPCRouter({
  auth: authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
