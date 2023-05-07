import React, { useContext, useRef } from "react";
import {
  Image,
  ScrollView,
  TextInput as RNTextInput,
  View
} from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import { ErrorContext } from "../../../src/utils/error-context";
import { UNIMPLETMENTED_MESSAGE } from "../../../src/utils/constants";
import Logo from "assets/images/happy-kids-logo.png";

const LoginScreen = () => {
  const { onLogin } = useAuthContext();
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showFailLogin, setShowFailLogin] = React.useState<boolean>(false);
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  const loginMutation = api.auth.userLogin.useMutation({
    onSuccess: (data) => {
      if (data && data.success) {
        onLogin({
          accessToken: data.accessToken as string,
          userId: data.userId,
          classId: data.classId,
          isTeacher: data.isTeacher
        });
      } else {
        setShowFailLogin(true);
      }
    },
    onError: () => setShowFailLogin(true)
  });

  const passwordRef = useRef<RNTextInput>(null);

  const onPressLogin = () => {
    loginMutation.mutate({ username, password });
  };
  return (
    <View className="flex-1 bg-white">
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

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View className={"px-4"}>
          <View>
            <Image
              source={Logo}
              className={"h-64 w-full self-center"}
              resizeMode={"contain"}
            />
            <TextInput
              label={"Tên đăng nhập"}
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
            <View className={"mt-4 flex-row items-center justify-end"}>
              <Button
                mode={"text"}
                onPress={() => setGlobalErrorMessage(UNIMPLETMENTED_MESSAGE)}
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
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
