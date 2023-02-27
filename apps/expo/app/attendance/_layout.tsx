import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Theme from "../../src/utils/theme";
import AttendanceHome from "./index";
import AttendanceStatistics from "./statistics";

const Tab = createMaterialTopTabNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: Theme.colors.primary },
        tabBarActiveTintColor: Theme.colors.white,
        tabBarLabelStyle: {
          textTransform: "capitalize"
        }
      }}
    >
      <Tab.Screen name={"History"} component={AttendanceHome}></Tab.Screen>
      <Tab.Screen
        name={"Statistics"}
        component={AttendanceStatistics}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default RootLayout;
