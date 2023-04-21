import { ScrollView, View, Text } from "react-native";
import { useState } from "react";
import { Card } from "react-native-paper";

import Body from "../../components/Body";
import CustomStackScreen from "../../components/CustomStackScreen";
import UpdateComponent from "../../components/common/UpdateComponent";
import EditableFormField from "../../components/account/EditableFormField";

import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";
import { validatePassword } from "../../utils/password-validator";

const AccountChangePassword = () => {
  const { userId } = useAuthContext();
  if (!userId) throw Error("account_change_password: missing userId");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassAgain, setNewPassAgain] = useState("");

  const [oldPassError, setOldPassError] = useState("");
  const [newPassError, setNewPassError] = useState("");
  const [newPassAgainError, setNewPassAgainError] = useState("");

  const isError =
    oldPassError !== "" || newPassError !== "" || newPassAgainError != "";

  const updatePass = api.account.updatePassword.useMutation({
    onSuccess: (data) => {
      if (data === "") {
        alert("Cập nhật thành công");
        setOldPass("");
        setNewPass("");
        setNewPassAgain("");
      } else if (data === "wrong_pass") {
        setOldPassError("Sai mật khẩu hiện tại");
      } else {
        alert("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  });

  const onSubmit = () => {
    const newPassErr = validatePassword(newPass);
    if (newPassErr !== "") {
      setNewPassError(newPassErr);
      return;
    }
    if (newPass !== newPassAgain) {
      setNewPassAgainError("Mật khẩu không khớp");
      return;
    }
    updatePass.mutate({
      userId,
      oldPass,
      newPass
    });
  };

  return (
    <Body>
      <CustomStackScreen title="Đổi mật khẩu" />
      <ScrollView className="flex-1">
        <Card>
          <Text className="my-3 px-3 text-center text-sm ">
            Vui lòng nhập mật khẩu hiện tại và mật khẩu mới
          </Text>
        </Card>
        <View className="flex-1">
          <View className="p-4">
            <Text className="text-sm font-bold">Mật khẩu hiện tại</Text>
            <EditableFormField
              placeholder="Nhập mật khẩu hiện tại"
              setText={(value) => {
                setOldPass(value);
                setOldPassError("");
              }}
              text={oldPass}
              textInputProps={{
                secureTextEntry: true,
                autoCapitalize: "none",
                textContentType: "password"
              }}
              error={oldPassError}
            />

            <Text className="text-sm font-bold">Mật khẩu mới</Text>
            <EditableFormField
              placeholder="Nhập mật khẩu mới"
              setText={(value) => {
                setNewPass(value);
                setNewPassError("");
              }}
              text={newPass}
              textInputProps={{
                secureTextEntry: true,
                autoCapitalize: "none",
                textContentType: "newPassword"
              }}
              error={newPassError}
            />

            <EditableFormField
              placeholder="Nhập lại mật khẩu mới"
              setText={(value) => {
                setNewPassAgain(value);
                setNewPassAgainError("");
              }}
              text={newPassAgain}
              textInputProps={{
                secureTextEntry: true,
                autoCapitalize: "none"
              }}
              error={newPassAgainError}
            />

            <UpdateComponent
              disabled={isError}
              isAnyChanged={true}
              isUpdating={updatePass.isLoading}
              onSubmit={onSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </Body>
  );
};

export default AccountChangePassword;
