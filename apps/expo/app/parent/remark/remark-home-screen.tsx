import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { Stack, useSearchParams } from "expo-router";
import DailyRemarkScreen from "./daily-remark-screen";
import PeriodRemarkScreen from "./period-remark-screen";

const Tab = createMaterialTopTabNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RemarkHomeScreen = () => {
  const { colors } = useTheme();
  const { studentId } = useSearchParams();

  const [studentIdSaved, setStudentIdSaved] = useState("");

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    studentId && setStudentIdSaved(studentId);
  }, [studentId]);

  return (
    <>
      <Stack.Screen options={{ title: "Nhận xét" }} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.primary },
          tabBarActiveTintColor: colors.onPrimary,
          tabBarLabelStyle: {
            textTransform: "capitalize"
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.onPrimary
          }
        }}
      >
        <Tab.Screen name={"Ngày"}>
          {() => <DailyRemarkScreen studentId={studentIdSaved} />}
        </Tab.Screen>
        <Tab.Screen name={"Tháng"}>
          {() => <PeriodRemarkScreen studentId={studentIdSaved} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};

export default RemarkHomeScreen;
