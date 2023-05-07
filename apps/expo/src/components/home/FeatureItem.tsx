import { Image, ImageSourcePropType, Pressable, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";

const FeatureItem = (props: {
  title: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
}) => {
  return (
    <View className={"mr-1"}>
      <Pressable onPress={props.onPress} className={"w-20 flex-col"}>
        <Image
          className={"m-auto aspect-square h-10 w-1/6 w-10"}
          source={props.icon}
        />
        <Text className={"text-center"}>{props.title}</Text>
      </Pressable>
    </View>
  );
};

export default FeatureItem;
