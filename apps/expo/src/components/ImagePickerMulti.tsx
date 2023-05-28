import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";
import AlertModal from "./common/AlertModal";
import { ActivityIndicator } from "react-native-paper";
interface PropsType {
  setImageData: (value: string[]) => void;
}

const MyImagePickerMulti = (props: PropsType) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    setVisible(false);
  };
  return (
    <View className="relative h-full w-full">
      <View className="flex h-full w-full justify-evenly">
        <Chip
          mode={"outlined"}
          icon={"camera"}
          className={"h-2/5 w-full"}
          disabled={loading}
          onPress={() => {
            setLoading(true);
            void pickMultiImageCameraFunc(props.setImageData)
              .catch((e) => {
                console.log(e);
                setVisible(true);
              })
              .then(() => setLoading(false));
          }}
        >
          Chụp ảnh
        </Chip>
        <Chip
          mode={"outlined"}
          icon={"folder"}
          disabled={loading}
          className={"h-2/5 w-full"}
          onPress={() => {
            setLoading(true);

            void pickMultiImageFileFunc(props.setImageData)
              .catch((e) => {
                console.log(e);
                setVisible(true);
              })
              .then(() => setLoading(false));
          }}
        >
          Chọn ảnh
        </Chip>
      </View>
      {loading && (
        <ActivityIndicator className="absolute h-full w-full bg-[#00000008]" />
      )}

      <AlertModal
        message="Có lỗi xảy ra, vui lòng thử lại"
        onClose={closeModal}
        visible={visible}
        title={"Lỗi"}
      />
    </View>
  );
};

const pickMultiImageFileFunc = async (setImage: (value: string[]) => void) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw Error("not grant library permission");
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    base64: true
  });

  if (!result.canceled) {
    setImage(
      result.assets
        .filter((item) => item.base64)
        .map((item) => item?.base64 ?? "")
    );
  }
};

const pickMultiImageCameraFunc = async (
  setImage: (value: string[]) => void
) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    throw Error("not grant library permission");
  }
  const result = await ImagePicker.launchCameraAsync({
    base64: true
  });

  if (!result.canceled) {
    setImage(
      result.assets
        .filter((item) => item.base64)
        .map((item) => item?.base64 ?? "")
    );
  }
};

export default MyImagePickerMulti;
