import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.background,
        headerStyle: {
          backgroundColor: colors.primary
        }
      }}
    >
      <Stack.Screen
        name={"attendanceTab"}
        options={{ title: "Điểm danh" }}
      ></Stack.Screen>
      <Stack.Screen
        name={"[id]"}
        options={{ title: "Chi tiết điểm danh" }}
      ></Stack.Screen>
    </Stack>
  );
};

export default RootLayout;
