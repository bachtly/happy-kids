/* eslint-disable @typescript-eslint/no-misused-promises */
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MyImagePickerProps {
  // React State passed from outside
  imageData: string;
  setImageData: (imageData: string) => void;
  disabled?: boolean;
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
    <View className="w-full h-full items-center">
      <TouchableOpacity className={"w-full h-full"} onPress={pickImage} disabled={props.disabled ?? false}>
        {imageData !== "" ? (
          <Image source={{ uri: imageData }} className={"h-full w-full"} />
        ) : (
          <View
            className={"h-full w-full items-center justify-center bg-gray-300"}
          >
            <Text className={"text-sm text-gray-500"}>Chọn ảnh</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MyImagePicker;
