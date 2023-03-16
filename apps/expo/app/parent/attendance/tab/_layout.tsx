import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "react-native-paper";
import HistoryScreen from "./history-screen";
import StatisticsScreen from "./statistics-screen";

const Tab = createMaterialTopTabNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
const AttendanceLayout = () => {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Điểm danh" }} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.primary },
          tabBarActiveTintColor: colors.white,
          tabBarLabelStyle: {
            textTransform: "capitalize"
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.white
          }
        }}
      >
        <Tab.Screen name={"Lịch sử"} component={HistoryScreen} />
        <Tab.Screen name={"Thống kê"} component={StatisticsScreen} />
      </Tab.Navigator>
    </>
  );
};

export default AttendanceLayout;
