import { useRouter, useSegments } from "expo-router";
import React from "react";

export type AuthContextType = {
  userId: string | null;
  onLogin: (userId: string) => void;
  onLogout: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  userId: null,
  onLogin: (_) => {},
  onLogout: () => {}
});

type ProviderProps = {
  children: React.ReactNode;
};
export const AuthContextProvider = ({ children }: ProviderProps) => {
  const [userId, setUserId] = React.useState<string | null>(null);

  useProtectedRoute(userId);

  return (
    <AuthContext.Provider
      value={{
        userId: userId,
        onLogin: (userId) => setUserId(userId),
        onLogout: () => setUserId(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// This hook can be used to access the user info.
export function useAuthContext() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(userId: string | null) {
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
      router.replace("/login-screen");
    } else if (userId && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [userId, segments]);
}
