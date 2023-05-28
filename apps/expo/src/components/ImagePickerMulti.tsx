import * as ImagePicker from "expo-image-picker";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

interface PropsType {
  setImageData: (value: string[]) => void;
}

const MyImagePickerMulti = (props: PropsType) => {
  return (
    <View className="h-full w-full items-center">
      <TouchableOpacity
        className={"h-full w-full"}
        onPress={() => void pickMultiImageFunc(props.setImageData)}
      >
        <View
          className={"h-full w-full items-center justify-center bg-gray-300"}
        >
          <Text className={"text-white"} variant={"displayMedium"}>
            +
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const pickMultiImageFunc = async (setImage: (value: string[]) => void) => {
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

export default MyImagePickerMulti;
