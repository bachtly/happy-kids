import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

export const userIdKey = "userId";
export type AuthContextType = {
  isLoading: boolean;
  userId: string | null;
  onLogin: (userId: string) => void;
  onLogout: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  isLoading: false,
  userId: null,
  onLogin: (_) => {},
  onLogout: () => {}
});

type ProviderProps = {
  children: React.ReactNode;
};

const useProtectedRoute = (userId: string | null) => {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !userId &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/login/login-screen");
    } else if (userId && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/home-screen");
    }
  }, [userId, segments]);
};

export const AuthContextProvider = ({ children }: ProviderProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [userId, setUserId] = React.useState<string | null>(null);

  useProtectedRoute(userId);

  useEffect(() => {
    void SecureStore.getItemAsync(userIdKey)
      .then((userId) => {
        setUserId(userId);
        setIsLoading(false);
      })
      .catch((_) => setIsLoading(false));
  }, []);

  const setAndSaveUserToStore = (userId: string | null) => {
    setUserId(userId);
    if (userId) {
      void SecureStore.setItemAsync(userIdKey, userId);
    } else {
      void SecureStore.deleteItemAsync(userIdKey);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading: isLoading,
        userId: userId,
        onLogin: (userId) => setAndSaveUserToStore(userId),
        onLogout: () => setAndSaveUserToStore(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return React.useContext(AuthContext);
}
