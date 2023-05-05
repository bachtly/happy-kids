import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme, TextInput, Button } from "react-native-paper";
import { api } from "../../../src/utils/api";
import { Portal, Dialog } from "react-native-paper";
import { useRouter, useSearchParams } from "expo-router";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";

const SignupInformationScreen = () => {
  const [showEmptyNameError, setShowEmptyNameError] = useState<boolean>(false);
  const [showReenterPasswordNotMatch, setShowReenterPasswordNotMatch] =
    useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reenterPassword, setReenterPassword] = useState<string>("");
  const [hasTypePassword, setHasTypePassword] = useState<boolean>(false);
  const router = useRouter();
  const params = useSearchParams();
  const { email } = params;
  const { colors } = useTheme();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const showInputError = (shouldShow: boolean, text: string) => {
    return (
      shouldShow && (
        <Text style={{ color: colors.error }} className={"mt-2 text-xs"}>
          {text}
        </Text>
      )
    );
  };

  const [showSignupSucceededDialog, setShowSignupSucceededDialog] =
    useState<boolean>(false);
  const [showSignupFailedDialog, setShowSignupFailedDialog] =
    useState<boolean>(false);

  const passwordCharCntValid = password.length >= 8;
  const passwordContainsNumber = /\d/.test(password);
  const passwordContainsLowercase = /[a-z]/.test(password);
  const signupMutation = api.auth.userSignup.useMutation({
    onSuccess: (_) => setShowSignupSucceededDialog(true),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const onNextStep = () => {
    const invalidFullname =
      firstName.trim().length == 0 || lastName.trim().length == 0;
    if (invalidFullname) {
      setShowEmptyNameError(true);
    }
    const passwordDoesNotMatch = password != reenterPassword;
    if (passwordDoesNotMatch) {
      setShowReenterPasswordNotMatch(true);
    }
    setHasTypePassword(true);
    if (
      !invalidFullname &&
      !passwordDoesNotMatch &&
      passwordContainsLowercase &&
      passwordCharCntValid &&
      passwordContainsNumber
    ) {
      signupMutation.mutate({
        email: email ? email : "",
        fullName: `${firstName} ${lastName}`,
        password: password
      });
    }
  };

  const showPasswordInstruction = () => {
    const textColor = (valid: boolean) => {
      return hasTypePassword
        ? valid
          ? colors.tertiary
          : colors.error
        : "black";
    };
    const iconName = (valid: boolean) => {
      return hasTypePassword ? (valid ? "check" : "close") : "circle-outline";
    };

    return (
      <View className={"mt-4"}>
        <View className={"flex-row items-center space-x-1"}>
          <Icon
            color={textColor(passwordCharCntValid)}
            name={iconName(passwordCharCntValid)}
          ></Icon>
          <Text
            style={{ color: textColor(passwordCharCntValid) }}
            className={"text-xs"}
          >
            Gồm ít nhất 8 ký tự
          </Text>
        </View>
        <View className={"mt-1 flex-row items-center space-x-1"}>
          <Icon
            color={textColor(passwordContainsNumber)}
            name={iconName(passwordContainsNumber)}
          ></Icon>
          <Text
            style={{ color: textColor(passwordContainsNumber) }}
            className={"text-xs"}
          >
            Phải có ít nhất một chữ số
          </Text>
        </View>
        <View className={"mt-1 flex-row items-center space-x-1"}>
          <Icon
            color={textColor(passwordContainsLowercase)}
            name={iconName(passwordContainsLowercase)}
          ></Icon>
          <Text
            style={{ color: textColor(passwordContainsLowercase) }}
            className={"text-xs"}
          >
            Phải có ít nhất một chữ cái viết thường
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <CustomStackScreen title={"Thông tin cá nhân"} />
      <View className={"h-full w-full flex-col bg-white p-4"}>
        <Text className={"text-lg font-semibold"}>Thông tin tài khoản</Text>
        <Text className={"mt-4"}>
          Hoàn tất thông tin bên dưới để tạo tài khoản
        </Text>
        <TextInput
          textContentType={"emailAddress"}
          className={"mt-6"}
          label={"Email"}
          mode={"outlined"}
          value={email}
          editable={false}
          onSubmitEditing={() => onNextStep()}
          style={{ backgroundColor: colors.surfaceDisabled }}
        />
        <View className={"mt-4 flex flex-row space-x-2"}>
          <TextInput
            mode={"outlined"}
            className={"w-6/12"}
            label="Họ"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setShowEmptyNameError(false);
            }}
          />
          <TextInput
            mode={"outlined"}
            className={"w-6/12"}
            label={"Tên"}
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setShowEmptyNameError(false);
            }}
          />
        </View>
        {showInputError(showEmptyNameError, "Vui lòng nhập đầy đủ họ và tên")}
        <TextInput
          className={"mt-4"}
          mode={"outlined"}
          label={"Mật khẩu"}
          textContentType={"password"}
          secureTextEntry={true}
          value={password}
          onChangeText={(newText) => {
            setPassword(newText);
            setHasTypePassword(true);
          }}
        />
        {showPasswordInstruction()}
        <TextInput
          label={"Nhập lại mật khẩu"}
          value={reenterPassword}
          secureTextEntry={true}
          onChangeText={(text) => {
            setReenterPassword(text);
            setShowReenterPasswordNotMatch(false);
          }}
          mode={"outlined"}
          className={"mt-4"}
        />
        {showInputError(showReenterPasswordNotMatch, "Mật khẩu không khớp")}
        <Button
          className={"mt-4"}
          mode={"contained"}
          onPress={onNextStep}
          loading={signupMutation.isLoading}
        >
          Hoàn thành đăng kí
        </Button>
      </View>
      <Portal>
        <Dialog
          visible={showSignupFailedDialog}
          onDismiss={() => setShowSignupFailedDialog(false)}
        >
          <Dialog.Title>
            <Text>Đăng ký tài khoản thất bại</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text>Đã có lỗi trong quá trình đăng ký, vui lòng thử lại</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSignupFailedDialog(false)}>
              Đồng ý
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={showSignupSucceededDialog}
          onDismiss={() => setShowSignupSucceededDialog(false)}
        >
          <Dialog.Title>
            <Text>Đăng ký tài khoản thành công</Text>
          </Dialog.Title>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setShowSignupSucceededDialog(false);
                router.push("/login/login-screen");
              }}
            >
              Đăng nhập
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default SignupInformationScreen;
