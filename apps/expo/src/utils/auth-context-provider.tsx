import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { StackActions } from "@react-navigation/native";
import { setNewToken } from "./api";

export const classKey = "classToken";
export const isTeacherKey = "isTeacherToken";
export const studentKey = "studentToken";
export const accessTokenKey = "accessTokenKey";
export const userIdKey = "userId";
export type AuthContextType = {
  isLoading: boolean;
  accessToken: string | null;
  userId: string | null;
  studentId: string | null;
  classId: string | null;
  isTeacher: boolean | null;
  onLogin: (a: {
    accessToken: string | null;
    userId: string | null;
    classId: string | null;
    isTeacher: boolean | null;
    studentId?: string | null;
  }) => void;
  onLogout: () => void;
  setStudentId: (a: string) => void;
  setClassId: (a: string) => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  isLoading: false,
  accessToken: null,
  userId: null,
  studentId: null,
  classId: null,
  isTeacher: null,
  onLogin: (_) => {},
  onLogout: () => {},
  setStudentId: (_) => {},
  setClassId: (_) => {}
});

type ProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: ProviderProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [studentId, setStudentId] = React.useState<string | null>(null);
  const [classId, setClassId] = React.useState<string | null>(null);
  const [isTeacher, setIsTeacher] = React.useState<boolean | null>(null);

  const router = useRouter();
  const segments = useSegments();
  const navigation = useNavigation();

  const isInAuthGroup = () => segments[0] === "(auth)";

  useEffect(() => {
    void SecureStore.getItemAsync(accessTokenKey)
      .then((accessToken) => {
        setAccessToken(accessToken);
        setIsLoading(false);
      })
      .catch((_) => setIsLoading(false));

    void SecureStore.getItemAsync(userIdKey)
      .then((userId) => {
        setUserId(userId);
        setIsLoading(false);
      })
      .catch((_) => setIsLoading(false));

    void SecureStore.getItemAsync(studentKey)
      .then((resp) => {
        setStudentId(resp);
        setIsLoading(false);
      })
      .catch((_) => setIsLoading(false));

    void SecureStore.getItemAsync(isTeacherKey)
      .then((resp) => {
        setIsTeacher(resp == null ? null : resp !== "0");
        setIsLoading(false);
      })
      .catch((_) => setIsLoading(false));

    void SecureStore.getItemAsync(classKey)
      .then((resp) => {
        setClassId(resp);
        setIsLoading(false);
      })
      .catch((_) => setIsLoading(false));
  }, []);

  useEffect(() => {
    setNewToken(accessToken ?? "");

    if (!accessToken && !isInAuthGroup()) {
      if (navigation.canGoBack()) navigation.dispatch(StackActions.popToTop());
      router.replace("login/login-screen");
    } else if (accessToken && isInAuthGroup() && isTeacher != null) {
      // navigation.navigate({pathname: "temporary-dashboard"})
      if (isTeacher) {
        router.replace({
          pathname: "teacher/teacher-landing-screen"
        });
      } else {
        router.replace({
          pathname: "parent/parent-landing-screen"
        });
      }
    }
  }, [accessToken, segments, studentId, classId, isTeacher]);

  const setAndSaveUserToStore = ({
    accessToken,
    userId,
    classId,
    studentId,
    isTeacher
  }: {
    accessToken: string | null;
    userId: string | null;
    classId: string | null;
    isTeacher: boolean | null;
    studentId?: string | null;
  }) => {
    setAccessToken(accessToken);
    setUserId(userId);
    setStudentId(studentId ?? null);
    setClassId(classId);
    setIsTeacher(isTeacher);
    if (accessToken && userId) {
      void SecureStore.setItemAsync(studentKey, studentId ?? "");
      void SecureStore.setItemAsync(classKey, classId ?? "");
      void SecureStore.setItemAsync(isTeacherKey, isTeacher ? "1" : "0");
      void SecureStore.setItemAsync(accessTokenKey, accessToken);
      void SecureStore.setItemAsync(userIdKey, userId);
    } else {
      void SecureStore.deleteItemAsync(studentKey);
      void SecureStore.deleteItemAsync(classKey);
      void SecureStore.deleteItemAsync(isTeacherKey);
      void SecureStore.deleteItemAsync(accessTokenKey);
      void SecureStore.deleteItemAsync(userIdKey);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userId: userId,
        isLoading: isLoading,
        accessToken: accessToken,
        studentId: studentId,
        classId: classId,
        isTeacher: isTeacher,
        onLogin: ({ accessToken, userId, classId, studentId, isTeacher }) =>
          setAndSaveUserToStore({
            accessToken,
            userId,
            studentId,
            classId,
            isTeacher
          }),
        onLogout: () =>
          setAndSaveUserToStore({
            accessToken: null,
            userId: null,
            classId: null,
            studentId: null,
            isTeacher: null
          }),
        setStudentId,
        setClassId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return React.useContext(AuthContext);
}
