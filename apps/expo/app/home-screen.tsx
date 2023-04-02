import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuthContext } from "../src/utils/auth-context-provider";
import CustomStackScreen from "../src/components/CustomStackScreen";

const HomeScreen = () => {
  const { onLogout } = useAuthContext();
  const router = useRouter();
  const studentId = "stid1000-0000-0000-0000-000000000000";
  const classId = "clid1000-0000-0000-0000-000000000000";

  return (
    <View>
      <CustomStackScreen title={"Trang chủ"} />
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

      <Button
        onPress={() =>
          router.push({
            pathname: "parent/pickup/history-screen",
            params: {
              studentId: "stid1000-0000-0000-0000-000000000000"
            }
          })
        }
      >
        Đón về phụ huynh
      </Button>

      <Button
        onPress={() =>
          router.push({
            pathname: "teacher/pickup/history-screen",
            params: {
              classId: "clid1000-0000-0000-0000-000000000000"
            }
          })
        }
      >
        Đón về giáo viên
      </Button>

      <Button
        onPress={() =>
          router.push({
            pathname: "parent/leaveletter/leaveletter-home-screen",
            params: { studentId }
          })
        }
      >
        Xin nghỉ Phụ huynh
      </Button>
      <Button
        onPress={() =>
          router.push({
            pathname: "teacher/leaveletter/leaveletter-home-screen",
            params: { classId }
          })
        }
      >
        Xin nghỉ Giáo viên
      </Button>

      <Button onPress={onLogout}>Logout</Button>
    </View>
  );
};

export default HomeScreen;
