import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import HistoryScreen from "./history-screen";
import StatisticsScreen from "./statistics-screen";
import { useSearchParams } from "expo-router";
import { AttendanceContext } from "../../../../src/utils/attendance-context";
import CustomStackScreen from "../../../../src/components/CustomStackScreen";

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
    <AttendanceContext.Provider value={{ studentId: studentIdSaved }}>
      <CustomStackScreen title={"Điểm danh"} />
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
    </AttendanceContext.Provider>
  );
};

export default AttendanceLayout;
