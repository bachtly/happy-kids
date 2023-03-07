import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import {Stack} from "expo-router"

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{
      headerTintColor:colors.background,
      headerStyle: {
        backgroundColor: colors.primary
      }
    }}>
      <Stack.Screen name={'attendanceTab'} options={{title: 'Điểm danh'}}></Stack.Screen>
      <Stack.Screen name={'detail'}></Stack.Screen>
    </Stack>
  );
};

export default RootLayout;
