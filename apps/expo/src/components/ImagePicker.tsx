import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import SingleImageView from "./common/SingleImageView";

interface MyImagePickerProps {
  // React State passed from outside
  imageData: string;
  setImageData: (imageData: string) => void;
  disabled?: boolean;
  onPress?: () => void;
  size?: number;
}

const MyImagePicker = (props: MyImagePickerProps) => {
  const [imageData, setImageData] = useState<string>(props.imageData);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true // Set to true to get image data in base64 format
    });

    if (!result.canceled) {
      if (result.assets[0]?.base64) {
        setImageData(result.assets[0].base64); // Store the base64 data in state
        props.setImageData(result.assets[0].base64);
      }
    }
  };

  return (
    <View className={"flex-1"}>
      {imageData !== "" && (
        <View
          className={
            props.size ? `h-${props.size} w-${props.size} mb-2` : "mb-2"
          }
        >
          <SingleImageView image={imageData} />
        </View>
      )}

      <IconButton
        className="m-0"
        mode="outlined"
        onPress={() => {
          props.onPress ? props.onPress() : void pickImage();
        }}
        icon={"camera"}
      />
    </View>
  );
};

export const pickImageFunc = async ({
  setImage
}: {
  setImage: (value: string) => void;
}) => {
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

export default MyImagePicker;
