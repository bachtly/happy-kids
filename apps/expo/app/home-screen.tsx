import { Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuthContext } from "../src/utils/auth-context-provider";

const HomeScreen = () => {
  const { onLogout } = useAuthContext();
  const router = useRouter();
  const studentId = "stid1000-0000-0000-0000-000000000000";
  const classId = "clid1000-0000-0000-0000-000000000000";

  return (
    <View>
      <Stack.Screen options={{ title: "Trang chủ" }} />
      <Text onPress={() => onLogout()}>Home screen</Text>
      <Button
        onPress={() =>
          router.push({
            pathname: "/parent/attendance/tab/history-screen",
            params: {
              studentId
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
              classId
            }
          })
        }
      >
        Điểm danh Giáo viên
      </Button>
      <Button
        onPress={() =>
          router.push({
            pathname: "parent/medicine/medicine-home-screen",
            params: { studentId }
          })
        }
      >
        Go to parent Medicine
      </Button>
      <Button
        onPress={() =>
          router.push({
            pathname: "teacher/medicine/medicine-home-screen",
            params: { classId }
          })
        }
      >
        Go to teacher Medicine
      </Button>
    </View>
  );
};

export default HomeScreen;
