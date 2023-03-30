import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";
import MyImagePicker from "../ImagePicker";

const NewRelativeModal = ({
  visible,
  close
}: {
  visible: boolean;
  close: () => void;
}) => {
  const { userId } = useAuthContext();

  const [note, setNote] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [phone, setPhone] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string | null>(null);

  const pickupMutation = api.pickup.insertRelative.useMutation({
    onSuccess: (_) => {
      close();
    }
  });

  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} style={{ maxHeight: 600 }}>
        <Dialog.Title>Thêm người đón</Dialog.Title>
        <Dialog.ScrollArea className={"px-6 py-2"}>
          <ScrollView className={"px-1 pt-1"}>
            <View className={"mb-2"}>
              <Text variant={"labelLarge"} className={""}>
                Họ tên
              </Text>

              <TextInput
                className={"text-sm"}
                placeholder="Nhập họ và tên"
                mode={"outlined"}
                onChangeText={(input) => setFullname(input)}
              />
            </View>

            <View className={"mb-2"}>
              <Text variant={"labelLarge"} className={""}>
                Số điện thoại
              </Text>

              <TextInput
                className={"text-sm"}
                placeholder="Nhập số điện thoại"
                mode={"outlined"}
                onChangeText={(input) => setPhone(input)}
              />
            </View>

            <View className={"mb-2"}>
              <Text variant={"labelLarge"} className={""}>
                Quan hệ với bé
              </Text>

              <TextInput
                className={"text-sm"}
                placeholder="Nhập mối quan hệ với bé"
                mode={"outlined"}
                onChangeText={(input) => setNote(input)}
              />
            </View>

            <View className={"mb-2"}>
              <Text variant={"labelLarge"} className={""}>
                Hình ảnh
              </Text>

              <View className={"h-20 w-20"}>
                <MyImagePicker imageData={avatar} setImageData={setAvatar} />
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          <Button
            onPress={() => {
              close();
            }}
          >
            Hủy
          </Button>
          <Button
            onPress={() => {
              fullname &&
                phone &&
                note &&
                avatar &&
                userId &&
                pickupMutation.mutate({
                  fullname: fullname,
                  phone: phone,
                  note: note,
                  avatarData: avatar,
                  parentId: userId
                });
            }}
          >
            Lưu
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default NewRelativeModal;
