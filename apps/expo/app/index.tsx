import { Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuthContext } from "../src/utils/auth-context-provider";

export default function Index() {
  const { onLogout } = useAuthContext();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Trang chủ" }} />
      <Text onPress={() => onLogout()}>Sign Out</Text>
      <Button
        onPress={() => router.push("/parent/attendance/tab/history-screen")}
      >
        Phụ huynh
      </Button>
      <Button onPress={() => router.push("/teacher/attendance")}>
        Giáo viên
      </Button>
    </View>
  );
}
