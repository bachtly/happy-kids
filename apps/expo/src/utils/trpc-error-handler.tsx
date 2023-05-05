import {
  TRPC_ERROR_CODES_BY_KEY,
  TRPC_ERROR_CODES_BY_NUMBER
} from "@trpc/server/rpc";
import { ErrorContextProps } from "./error-context";
import { AuthContextType } from "./auth-context-provider";

export const trpcErrorHandler = (f: () => void) => {
  return (
    code: string,
    message: string,
    errorContext: ErrorContextProps,
    authContext: AuthContextType
  ) => {
    if (
      code ===
      TRPC_ERROR_CODES_BY_NUMBER[
        TRPC_ERROR_CODES_BY_KEY.UNAUTHORIZED
      ].toString()
    ) {
      errorContext.setGlobalErrorMessage(message);
      authContext.onLogout();
    } else {
      errorContext.setGlobalErrorMessage(message);
    }

    f();
  };
};
