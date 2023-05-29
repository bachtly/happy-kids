import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { View } from "react-native";
import { Chip, IconButton } from "react-native-paper";
import SingleImageView from "./common/SingleImageView";
import RNModal from "react-native-modal";
interface MyImagePickerProps {
  // React State passed from outside
  imageData: string;
  setImageData: (imageData: string) => void;
  disabled?: boolean;
  size?: number;
}

const MyImagePicker = (props: MyImagePickerProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <View className={"flex-1"}>
      <RNModal
        isVisible={visible}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        onBackdropPress={() => setVisible(false)}
        useNativeDriver={true}
      >
        <Chip
          className={"mb-2 h-12 w-1/2 self-center"}
          mode={"outlined"}
          icon={"camera"}
          onPress={() => {
            void pickImageCameraFunc(props.setImageData).catch((e) =>
              console.log(e)
            );
            setVisible(false);
          }}
        >
          Chụp ảnh
        </Chip>
        <Chip
          className={"h-12 w-1/2 self-center"}
          mode={"outlined"}
          icon={"folder"}
          onPress={() => {
            void pickImageFunc(props.setImageData).catch((e) => console.log(e));
            setVisible(false);
          }}
        >
          Chọn ảnh
        </Chip>
      </RNModal>
      {props.imageData !== "" && (
        <View
          className={"mb-2"}
          style={
            props.size
              ? { width: props.size * 4, height: props.size * 4 }
              : undefined
          }
        >
          <SingleImageView image={props.imageData} />
        </View>
      )}

      <IconButton
        className="m-0"
        mode="outlined"
        onPress={() => setVisible(true)}
        icon={"camera"}
      />
    </View>
  );
};

export const pickImageFunc = async (setImage: (value: string) => void) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw Error("not grant library permission");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    base64: true // Set to true to get image data in base64 format
  });

  if (!result.canceled) {
    if (result.assets[0]?.base64) {
      setImage(result.assets[0].base64); // Store the base64 data in state
    }
  }
};

const pickImageCameraFunc = async (setImage: (value: string) => void) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    throw Error("not grant library permission");
  }
  const result = await ImagePicker.launchCameraAsync({
    base64: true
  });

  if (!result.canceled) {
    if (result.assets[0]?.base64) {
      setImage(result.assets[0].base64); // Store the base64 data in state
    }
  }
};

export default MyImagePicker;
