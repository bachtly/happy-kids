import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { api } from "../../utils/api";
import AlertModal from "../common/AlertModal";
import MultiImagePicker from "../common/MultiImagePicker";

interface PropsType {
  visible: boolean;
  onClose: () => void;
  fetchData: () => void;
  classId: string;
  studentId: string;
}

const AlbumAddModal = (props: PropsType) => {
  const { visible, onClose, classId } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [submitDisable, setSubmitDisable] = useState(false);

  const [submitFailed, setSubmitFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addMutation = api.album.insertAlbum.useMutation({
    onSuccess: (_) => {
      props.fetchData();
      closeModal();
    },
    onError: (e) => setErrorMessage(e.message),
    onSettled: () => setSubmitDisable(false)
  });

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setImageList([]);
    setSubmitDisable(false);
  };

  const addAlbum = () => {
    if (!(title !== "") || !(description !== "")) {
      setSubmitFailed(true);
      return;
    }
    addMutation.mutate({ title, description, photos: imageList, classId });
    setSubmitDisable(true);
  };

  const closeModal = () => {
    setSubmitFailed(false);
    resetFields();
    onClose();
  };

  return (
    <>
      <Portal>
        <Dialog
          visible={visible}
          dismissable={false}
          style={{ maxHeight: 600 }}
        >
          <Dialog.Title>{"Thêm album"}</Dialog.Title>
          <Dialog.ScrollArea className={"px-0"}>
            <ScrollView className={"px-6 pt-1"}>
              <View className="mb-2">
                <Text variant={"labelLarge"}>Tên album</Text>
                <TextInput
                  className={"text-sm"}
                  mode="outlined"
                  placeholder={"Nhập tên album"}
                  onChangeText={setTitle}
                  value={title}
                  error={submitFailed && title === ""}
                />
              </View>

              <View className="mb-2">
                <Text variant={"labelLarge"}>Mô tả</Text>
                <TextInput
                  className="text-sm"
                  mode="outlined"
                  placeholder={"Nhập mô tả"}
                  multiline
                  onChangeText={setDescription}
                  value={description}
                  error={submitFailed && description === ""}
                />
              </View>

              <View className="mb-2">
                <Text className="mb-2" variant={"labelLarge"}>
                  Ảnh
                </Text>
                <MultiImagePicker onImagesChange={setImageList} />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={closeModal}>Hủy</Button>
            <Button disabled={submitDisable} onPress={addAlbum}>
              Thêm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default AlbumAddModal;
