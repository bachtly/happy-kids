import { Stack } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { TextInput } from "react-native-paper"
import { Button, Checkbox, TextInput } from "react-native-paper";
import { api } from "../src/utils/api";

const Index = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [shouldSavePassword, setShouldSavePassword] = React.useState(false);
  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      console.log(data.status);
      console.log(data.message);
    }
  });
  return (
    <SafeAreaView className="bg-white">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Đăng nhập" }} />
      <View className={"h-full w-full flex-col p-4"}>
        <View className={"items-center"}>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Image source={require("../assets/icon.png")} />
        </View>
        <TextInput
          label={"Tài khoản"}
          value={username}
          onChangeText={setUsername}
          mode={"outlined"}
          left={<TextInput.Icon icon={"account"} />}
        />
        <View className={"mt-2"}>
          <TextInput
            label={"Mật khẩu"}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            mode={"outlined"}
            left={<TextInput.Icon icon={"key"} />}
          />
        </View>
        <View className={"mt-2 flex-row items-center justify-between"}>
          <View className={"flex-row items-center"}>
            <Checkbox
              status={shouldSavePassword ? "checked" : "unchecked"}
              onPress={() => setShouldSavePassword((prev) => !prev)}
            />
            <Text>Lưu mật khẩu</Text>
          </View>
          <Text className={"underline"}>Quên mật khẩu?</Text>
        </View>
        <View className={"my-auto mt-4 flex items-center"}>
          <Button
            className={"w-36"}
            mode={"contained"}
            onPress={() => loginMutation.mutate({ username, password })}
            loading={loginMutation.isLoading}
          >
            Đăng nhập
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
