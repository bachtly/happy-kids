import { Text } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";

import Body from "../../components/Body";
import LoadingBar from "../../components/common/LoadingBar";
import BigAvatar from "../../components/account/BigAvatar";
import CustomButton from "../../components/account/CustomButton";

import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import AlertModal from "../../components/common/AlertModal";
import { UNIMPLETMENTED_MESSAGE } from "../../utils/constants";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";

const AccountHome = ({ isTeacher }: { isTeacher?: boolean }) => {
  const folderName = isTeacher ? "teacher" : "parent";
  const router = useRouter();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const { onLogout } = authContext;

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { refetch, isFetching } = api.account.getAccountInfo.useQuery(
    {},
    {
      onSuccess: (data) => {
        const accGot = data.res;
        setName(accGot.fullname);
        setAvatar(accGot.avatar);
      },
      enabled: false,
      onError: ({ message, data }) =>
        trpcErrorHandler(() => {})(
          data?.code ?? "",
          message,
          errorContext,
          authContext
        )
    }
  );

  const fetchData = () => {
    refetch().catch((e: Error) => {
      console.log(e);
    });
  };

  // fetch data when focus
  const navigation = useNavigation();
  useEffect(() => {
    const focusListener = navigation.addListener("focus", fetchData);
    return focusListener;
  }, []);

  return (
    <Body>
      <LoadingBar isFetching={isFetching} />
      <ScrollView className="flex-1">
        <View className="flex-1">
          <View className="p-4">
            <BigAvatar
              image={avatar}
              onEditPress={() =>
                router.push(`/${folderName}/account/account-info-screen`)
              }
            />
            <Text className="mt-2 text-center">
              {name === "" ? "Tên người dùng" : name}
            </Text>
          </View>

          <View className="px-4">
            <CustomButton
              onPress={() =>
                router.push(`/${folderName}/account/account-info-screen`)
              }
              icon="account-circle"
              text="Thông tin tài khoản"
            />
            <CustomButton
              onPress={() =>
                router.push(`/${folderName}/account/account-change-pass-screen`)
              }
              icon="key-variant"
              text="Đổi mật khẩu"
            />
            <CustomButton
              onPress={() => setErrorMessage(UNIMPLETMENTED_MESSAGE)}
              icon="file-document"
              text="Hướng dẫn"
            />
            <CustomButton
              onPress={() => {
                setLogoutDialogVisible(true);
              }}
              icon="logout"
              text="Đăng xuất"
            />
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        onClose={() => setLogoutDialogVisible(false)}
        onConfirm={() => onLogout()}
        visible={logoutDialogVisible}
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default AccountHome;
