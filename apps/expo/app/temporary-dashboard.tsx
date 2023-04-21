import { Button } from "react-native-paper";
import { View } from "react-native";
import CustomStackScreen from "../src/components/CustomStackScreen";
import { useRouter } from "expo-router";
import { useAuthContext } from "../src/utils/auth-context-provider";

const DashBoard = () => {
  const router = useRouter();
  const { onLogin } = useAuthContext();

  return (
    <View className={"flex-1 content-center justify-center space-y-2 p-2"}>
      <CustomStackScreen title={"Dashboard"} />
      <Button
        mode={"contained"}
        onPress={() => {
          onLogin("prid1000-0000-0000-0000-000000000000");
          router.push({
            pathname: "parent/parent-landing-screen",
            params: {
              studentId: "stid1000-0000-0000-0000-000000000000",
              classId: "clid1000-0000-0000-0000-000000000000"
            }
          });
        }}
      >
        Tính năng của Phụ huynh
      </Button>

      <Button
        mode={"contained"}
        onPress={() => {
          onLogin("tid10000-0000-0000-0000-000000000000");
          router.push({
            pathname: "teacher/teacher-landing-screen",
            params: {
              classId: "clid1000-0000-0000-0000-000000000000"
            }
          });
        }}
      >
        Tính năng của Giáo viên
      </Button>
    </View>
  );
};

export default DashBoard;
