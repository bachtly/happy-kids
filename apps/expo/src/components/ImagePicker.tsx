import * as ImagePicker from "expo-image-picker";
import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import SingleImageView from "./common/SingleImageView";
interface MyImagePickerProps {
  // React State passed from outside
  imageData: string;
  setImageData: (imageData: string) => void;
  size?: number;
}

const MyImagePicker = (props: MyImagePickerProps) => {
  return (
    <View className={"flex-1"}>
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

      <View className="flex flex-row space-x-2">
        <IconButton
          className="m-0"
          mode="outlined"
          onPress={() => {
            void pickImageCameraFunc(props.setImageData).catch((e) =>
              console.log(e)
            );
          }}
          icon={"camera"}
        />
        <IconButton
          className="m-0"
          mode="outlined"
          onPress={() => {
            void pickImageFunc(props.setImageData).catch((e) => console.log(e));
          }}
          icon={"attachment"}
        />
      </View>
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
