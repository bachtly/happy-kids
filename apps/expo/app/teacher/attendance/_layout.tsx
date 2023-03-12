import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import AttendanceCheckout from "./checkout";
import AttendanceCheckin from "./index";

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
      <Tab.Screen
        name={"Điểm danh đến"}
        component={AttendanceCheckin}
      ></Tab.Screen>
      <Tab.Screen
        name={"Điểm danh về"}
        component={AttendanceCheckout}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default RootLayout;
