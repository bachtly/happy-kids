import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { useSearchParams } from "expo-router";
import DailyRemarkScreen from "./daily-remark-screen";
import PeriodRemarkScreen from "./period-remark-screen";
import CustomStackScreen from "../../../src/components/CustomStackScreen";

const Tab = createMaterialTopTabNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RemarkHomeScreen = () => {
  const { colors, fonts } = useTheme();
  const { classId } = useSearchParams();
  const [classIdSaved, setClassIdSaved] = useState("");

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    classId && setClassIdSaved(classId);
  }, [classId]);

  const headerTitleStyle = {
    fontFamily: fonts.labelMedium.fontFamily,
    fontSize: fonts.labelMedium.fontSize,
    fontWeight: fonts.labelMedium.fontWeight
  };

  return (
    <>
      <CustomStackScreen title={"Nhận xét"} />

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.primary },
          tabBarActiveTintColor: colors.onPrimary,
          tabBarLabelStyle: {
            ...headerTitleStyle,
            textTransform: "capitalize"
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.onPrimary
          }
        }}
      >
        <Tab.Screen name={"Ngày"}>
          {() => <DailyRemarkScreen classId={classIdSaved} />}
        </Tab.Screen>
        <Tab.Screen name={"Tháng"}>
          {() => <PeriodRemarkScreen classId={classIdSaved} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};

export default RemarkHomeScreen;
