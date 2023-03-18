import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import HistoryScreen from "./history-screen";
import StatisticsScreen from "./statistics-screen";
import { Stack, useSearchParams } from "expo-router";
import { ParentAttendanceContext } from "../../../../src/utils/parent-attendance-context";

const Tab = createMaterialTopTabNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
const AttendanceLayout = () => {
  const { colors } = useTheme();
  const { studentId } = useSearchParams();
  const [studentIdSaved, setStudentIdSaved] = useState("");

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    studentId && setStudentIdSaved(studentId);
  }, [studentId]);

  return (
    <ParentAttendanceContext.Provider value={{ studentId: studentIdSaved }}>
      <Stack.Screen options={{ title: "Điểm danh" }} />
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
        <Tab.Screen name={"Lịch sử"} component={HistoryScreen} />
        <Tab.Screen name={"Thống kê"} component={StatisticsScreen} />
      </Tab.Navigator>
    </ParentAttendanceContext.Provider>
  );
};

export default AttendanceLayout;
