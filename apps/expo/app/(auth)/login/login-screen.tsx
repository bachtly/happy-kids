import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Image, TextInput as RNTextInput, View } from "react-native";
import {
  Button,
  Checkbox,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme
} from "react-native-paper";
// import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";

const LoginScreen = () => {
  const { onLogin } = useAuthContext();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [shouldSavePassword, setShouldSavePassword] =
    React.useState<boolean>(false);
  const [showFailLogin, setShowFailLogin] = React.useState<boolean>(false);
  const { colors } = useTheme();
  // const loginMutation = api.auth.userLogin.useMutation({
  //   onSuccess: (data) => {
  //     if (data.userId !== null) {
  //       onLogin(data.userId);
  //     } else {
  //       setShowFailLogin(true);
  //     }
  //   }
  // });

  const router = useRouter();
  const passwordRef = useRef<RNTextInput>(null);

  const onPressLogin = () => {
    // loginMutation.mutate({ email: email, password });
    onLogin("prid1000-0000-0000-0000-000000000000");
  };
  return (
    <>
      <CustomStackScreen title={"Đăng nhập"} />
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

      <View className={"bg-white"}>
        <View className={"h-full w-full flex-col px-4"}>
          <Image
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            source={require("../../../assets/images/happy-kids-logo.png")}
            className={"mb-20 mt-24 h-32 w-96"}
            resizeMode={"cover"}
          />
          <View>
            <TextInput
              label={"Email"}
              value={email}
              onChangeText={setEmail}
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
              <Button
                mode={"text"}
                onPress={() =>
                  router.push("/forget-password/forget-password-screen")
                }
              >
                <Text className={"underline"}>Quên mật khẩu?</Text>
              </Button>
            </View>
            <View className={"mt-8 flex items-center"}>
              <Button
                mode={"contained"}
                onPress={onPressLogin}
                className={"w-36"}
              >
                Đăng nhập
              </Button>
            </View>
          </View>
          <View className={"mt-auto mb-10 flex items-center"}>
            <Button
              mode={"text"}
              className={"w-36"}
              buttonColor={colors.background}
              style={{ borderColor: colors.outline }}
              onPress={() => router.push("/signup/signup-email-screen")}
            >
              Tạo tài khoản mới
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

export default LoginScreen;
