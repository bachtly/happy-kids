import { Text, View } from "react-native";
import { useAuthContext } from "../src/utils/auth-context-provider";
import { Stack } from "expo-router";

const HomeScreen = () => {
  const { onLogout } = useAuthContext();
  return (
    <View>
      <Stack.Screen options={{ title: "Trang chủ" }} />
      <Text onPress={() => onLogout()}>Home screen</Text>
    </View>
  );
};

export default HomeScreen;
