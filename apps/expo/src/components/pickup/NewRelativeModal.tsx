import React, { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { TextInput } from "react-native-paper";
import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import FakeScreenSendWrapper from "../common/FakeScreenSendWrapper";
import WhiteBody from "../WhiteBody";
import CustomTitle from "../common/CustomTitle";
import Body from "../Body";
import ImagePicker from "../ImagePicker";

const NewRelativeModal = ({
  visible,
  close
}: {
  visible: boolean;
  close: () => void;
}) => {
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [note, setNote] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");

  const pickupMutation = api.pickup.insertRelative.useMutation({
    onSuccess: (_) => {
      close();
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  return (
    <FakeScreenSendWrapper
      visible={visible}
      title={"Thêm người đón"}
      onClose={close}
      sendButtonHandler={() => {
        pickupMutation.mutate({
          fullname: fullname ?? "",
          phone: phone,
          note: note,
          avatarData: avatar
        });
      }}
    >
      <Body>
        <ScrollView className={"flex-1"}>
          <View className={"mb-3 flex-1"}>
            <WhiteBody>
              <CustomTitle title={"Họ và tên"} />

              <TextInput
                className={"mx-3 mb-3 text-sm"}
                placeholder="Nhập họ và tên người đón"
                mode={"outlined"}
                multiline
                onChangeText={(input) => setFullname(input)}
                value={fullname}
              />
            </WhiteBody>
          </View>

          <View className={"mb-3 flex-1"}>
            <WhiteBody>
              <CustomTitle title={"Số điện thoại"} />

              <TextInput
                className={"mx-3 mb-3 text-sm"}
                placeholder="Nhập số điện thoại người đón"
                mode={"outlined"}
                multiline
                onChangeText={(input) => setPhone(input)}
                value={phone}
              />
            </WhiteBody>
          </View>

          <View className={"mb-3 flex-1"}>
            <WhiteBody>
              <CustomTitle title={"Quan hệ với bé"} />

              <TextInput
                className={"mx-3 mb-3 text-sm"}
                placeholder="Nhập mối quan hệ với bé"
                mode={"outlined"}
                multiline
                onChangeText={(input) => setNote(input)}
                value={note}
              />
            </WhiteBody>
          </View>

          <View className={"mb-3 flex-1"}>
            <WhiteBody>
              <CustomTitle title={"Hình ảnh"} />

              <View className={"px-3 pb-3"}>
                <ImagePicker
                  imageData={avatar}
                  setImageData={setAvatar}
                  size={24}
                />
              </View>
            </WhiteBody>
          </View>
        </ScrollView>
      </Body>
    </FakeScreenSendWrapper>
  );
};

export default NewRelativeModal;
