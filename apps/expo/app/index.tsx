import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useAuthContext } from "../src/utils/auth-context-provider";
export default function Index() {
  const { onLogout } = useAuthContext();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Trang chủ" }} />
      <Text onPress={() => onLogout()}>Sign Out</Text>
    </View>
  );
}
