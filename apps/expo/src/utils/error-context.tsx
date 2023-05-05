import { createContext, ReactNode, useState } from "react";
import AlertModal from "../components/common/AlertModal";

interface ErrorContextProps {
  setGlobalErrorMessage: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextProps>({
  setGlobalErrorMessage: () => {}
});

const ErrorContextProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const setGlobalErrorMessage = (message: string) => {
    setErrorMessage(message);
  };

  return (
    <ErrorContext.Provider
      value={{ setGlobalErrorMessage: setGlobalErrorMessage }}
    >
      {children}

      <AlertModal
        visible={errorMessage.trim() != ""}
        title={"Lỗi"}
        message={errorMessage}
        onClose={() => {
          setErrorMessage("");
        }}
      />
    </ErrorContext.Provider>
  );
};

export { ErrorContext, ErrorContextProvider };
export type { ErrorContextProps };
