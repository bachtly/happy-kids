import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import CheckinScreen from "./checkin-screen";
import CheckoutScreen from "./checkout-screen";
import { TeacherAttendanceContext } from "../../../../src/utils/attendance-context";
import CustomStackScreen from "../../../../src/components/CustomStackScreen";

const Tab = createMaterialTopTabNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
const AttendanceHomeScreen = () => {
  const { colors } = useTheme();
  const { classId } = useSearchParams();
  const [classIdSaved, setClassIdSaved] = useState("");

  useEffect(() => {
    classId && setClassIdSaved(classId);
  }, [classId]);

  return (
    <>
      <CustomStackScreen title={"Điểm danh"} />
      <TeacherAttendanceContext.Provider value={{ classId: classIdSaved }}>
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
          <Tab.Screen
            name={"Điểm danh đến"}
            component={CheckinScreen}
          ></Tab.Screen>
          <Tab.Screen
            name={"Điểm danh về"}
            component={CheckoutScreen}
          ></Tab.Screen>
        </Tab.Navigator>
      </TeacherAttendanceContext.Provider>
    </>
  );
};

export default AttendanceHomeScreen;
