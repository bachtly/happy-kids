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
      <Button onPress={() => router.push("attendance")}>Điểm danh</Button>
      <Text onPress={() => onLogout()}>Home screen</Text>
    </View>
  );
};

export default HomeScreen;
