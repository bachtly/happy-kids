import { Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuthContext } from "../src/utils/auth-context-provider";

const HomeScreen = () => {
  const { onLogout } = useAuthContext();
  const router = useRouter();

  return (
    <View>
      <Stack.Screen options={{ title: "Trang chủ" }} />
      <Text onPress={() => onLogout()}>Home screen</Text>
      <Button onPress={() => router.push("parent/attendance")}>
        Điểm danh phụ huynh
      </Button>
      <Button onPress={() => router.push("teacher/attendance")}>
        Điểm danh giáo viên
      </Button>
      <Button onPress={() => router.push("attendance")}>Điểm danh</Button>
    </View>
  );
};

export default HomeScreen;
