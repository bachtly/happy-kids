import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import AttendanceHome from "./index";
import AttendanceStatistics from "./statistics";
import {Text, View} from "react-native";
import {Slot, Stack} from "expo-router"
import AttendanceHistory from "./index";

const Tab = createMaterialTopTabNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const { colors } = useTheme();

  return (
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
      <Tab.Screen name={"Lịch sử"} component={AttendanceHistory}></Tab.Screen>
      <Tab.Screen
        name={"Thống kê"}
        component={AttendanceStatistics}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default RootLayout;
