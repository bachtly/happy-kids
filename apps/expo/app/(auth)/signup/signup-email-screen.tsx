import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  TextInput,
  useTheme
} from "react-native-paper";
import { api } from "../../../src/utils/api";
import emailValidatorUtils from "../../../src/utils/email-validator-utils";
import { useRouter } from "expo-router";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import { ErrorContext } from "../../../src/utils/error-context";
import { UNIMPLETMENTED_MESSAGE } from "../../../src/utils/constants";

const SignupEmailScreen = () => {
  const { colors } = useTheme();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const router = useRouter();
  const [showConfirmExitSignupModal, setShowConfirmExitSignupModal] =
    useState<boolean>(false);
  const [showEmailExistedModal, setShowEmailExistedModal] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [showInvalidEmailFormat, setShowInvalidEmailFormat] =
    useState<boolean>(false);

  const checkEmailExistenceMutation = api.auth.checkEmailExistence.useMutation({
    onSuccess: (data) => {
      if (data.isExisted === false) {
        router.push({
          pathname: "/signup/signup-information-screen",
          params: { email: email }
        });
      } else {
        setShowEmailExistedModal(true);
      }
    }
  });

  const onNextStep = () => {
    if (emailValidatorUtils.validateEmailFormat(email)) {
      checkEmailExistenceMutation.mutate({ email: email });
    } else {
      setShowInvalidEmailFormat(true);
    }
  };

  return (
    <>
      <CustomStackScreen title={"Đăng ký"} />
      <Portal>
        <Dialog
          visible={showConfirmExitSignupModal}
          onDismiss={() => setShowConfirmExitSignupModal(false)}
        >
          <Dialog.Content>
            <Text>Bạn đã có tài khoản rồi sao?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirmExitSignupModal(false)}>
              Tiếp tục tạo tài khoản
            </Button>
            <Button
              onPress={() => {
                router.push("/login/login-screen");
              }}
            >
              Đăng nhập
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showEmailExistedModal}>
          <Dialog.Content>
            <Text>Email đã được đăng kí</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setGlobalErrorMessage(UNIMPLETMENTED_MESSAGE);
                setShowEmailExistedModal(false);
              }}
            >
              Quên mật khẩu
            </Button>
            <Button
              onPress={() => {
                router.push("/login/login-screen");
              }}
            >
              Đăng nhập
            </Button>
            <Button onPress={() => setShowEmailExistedModal(false)}>Hủy</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View className={"h-full w-full flex-col bg-white p-4"}>
        <Text className={"text-lg font-semibold"}>Địa chỉ email của bạn?</Text>
        <Text className={"mt-4"}>
          Nhập địa chỉ email bạn thường xuyên sử dụng
        </Text>
        <TextInput
          textContentType={"emailAddress"}
          className={"mt-6"}
          label={"Email"}
          mode={"outlined"}
          value={email}
          onChangeText={(newText) => {
            setEmail(newText);
            setShowInvalidEmailFormat(false);
          }}
          error={showInvalidEmailFormat}
          onSubmitEditing={() => onNextStep()}
        />
        {showInvalidEmailFormat && (
          <Text style={{ color: colors.error }} className={"mt-2 text-xs"}>
            {"Vui lòng nhập địa chỉ email hợp lệ"}
          </Text>
        )}
        <Button
          className={"mt-4"}
          mode={"contained"}
          onPress={onNextStep}
          loading={checkEmailExistenceMutation.isLoading}
        >
          Tiếp
        </Button>
        <Button
          className={"mb-10 mt-auto"}
          onPress={() => setShowConfirmExitSignupModal(true)}
        >
          Bạn đã có tài khoản rồi sao?
        </Button>
      </View>
    </>
  );
};

export default SignupEmailScreen;
