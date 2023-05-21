import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { useSearchParams } from "expo-router";
import DailyRemarkScreen from "./daily-remark-screen";
import PeriodRemarkScreen from "./period-remark-screen";
import CustomStackScreen from "../../../src/components/CustomStackScreen";

const Tab = createMaterialTopTabNavigator();

const RemarkHomeScreen = () => {
  const { colors, fonts } = useTheme();
  const { studentId } = useSearchParams();

  const [studentIdSaved, setStudentIdSaved] = useState("");

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    studentId && setStudentIdSaved(studentId);
  }, [studentId]);

  const headerTitleStyle = {
    fontFamily: fonts.labelMedium.fontFamily,
    fontSize: fonts.labelMedium.fontSize,
    fontWeight: fonts.labelMedium.fontWeight,
    textTransform: "capitalize" as "capitalize" | "none"
  };

  return (
    <>
      <CustomStackScreen title={"Nhận xét"} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.primary },
          tabBarActiveTintColor: colors.onPrimary,
          tabBarLabelStyle: headerTitleStyle,
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
