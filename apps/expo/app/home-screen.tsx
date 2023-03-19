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
      <Button
        onPress={() =>
          router.push({
            pathname: "/parent/attendance/tab/history-screen",
            params: {
              studentId: "stid1000-0000-0000-0000-000000000000"
            }
          })
        }
      >
        Điểm danh Phụ huynh
      </Button>
      <Button
        onPress={() =>
          router.push({
            pathname: "/teacher/attendance",
            params: {
              classId: "clid1000-0000-0000-0000-000000000000"
            }
          })
        }
      >
        Điểm danh Giáo viên
      </Button>
    </View>
  );
};

export default HomeScreen;
