import { Stack } from "expo-router";
import React, { useRef } from "react";
import { Image, View } from "react-native";
import {
  Button,
  Checkbox,
  TextInput,
  Portal,
  Dialog,
  Text
} from "react-native-paper";
import { TextInput as RNTextInput } from "react-native";
import { api } from "../../src/utils/api";
import { useAuthContext } from "../../src/utils/auth-context-provider";

const LoginScreen = () => {
  const { onLogin } = useAuthContext();
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [shouldSavePassword, setShouldSavePassword] =
    React.useState<boolean>(false);
  const [showFailLogin, setShowFailLogin] = React.useState<boolean>(false);

  const loginMutation = api.auth.userLogin.useMutation({
    onSuccess: (data) => {
      if (data.userId !== null) {
        onLogin(data.userId);
      } else {
        setShowFailLogin(true);
      }
    }
  });

  const passwordRef = useRef<RNTextInput>(null);

  const onPressLogin = () => {
    console.log("trying to login");
    loginMutation.mutate({ username, password });
  };
  return (
    <View className={"bg-white"}>
      <Stack.Screen options={{ title: "Đăng nhập" }} />
      <Portal>
        <Dialog
          visible={showFailLogin}
          onDismiss={() => setShowFailLogin(false)}
        >
          <Dialog.Title>Đăng nhập thất bại</Dialog.Title>
          <Dialog.Content>
            <Text className={"leading-6"}>
              Vui lòng kiểm tra tên đăng nhập, mật khẩu và thử lại
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowFailLogin(false)}>Đồng ý</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View className={"h-full w-full flex-col px-4"}>
        <Image
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
          source={require("../../assets/images/happy-kids-logo.png")}
          className={"mb-20 mt-24 h-32 w-96"}
          resizeMode={"cover"}
        />
        <View>
          <TextInput
            label={"Tài khoản"}
            value={username}
            onChangeText={setUsername}
            mode={"outlined"}
            left={<TextInput.Icon icon={"account"} />}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <View className={"mt-4"}>
            <TextInput
              ref={passwordRef}
              label={"Mật khẩu"}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              mode={"outlined"}
              left={<TextInput.Icon icon={"key"} />}
              onSubmitEditing={onPressLogin}
            />
          </View>
          <View className={"mt-4 flex-row items-center justify-between"}>
            <View className={"flex-row items-center"}>
              <Checkbox
                status={shouldSavePassword ? "checked" : "unchecked"}
                onPress={() => setShouldSavePassword((prev) => !prev)}
              />
              <Text>Lưu mật khẩu</Text>
            </View>
            <Text className={"underline"}>Quên mật khẩu?</Text>
          </View>
          <View className={"my-auto mt-8 flex items-center"}>
            <Button
              className={"w-36"}
              mode={"contained"}
              onPress={onPressLogin}
            >
              Đăng nhập
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
