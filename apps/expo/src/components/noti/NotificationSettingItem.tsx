import { Image, ImageSourcePropType, View } from "react-native";
import React from "react";
import { Switch, Text, Divider } from "react-native-paper";

const NotificationSettingItem = ({
  icon,
  label,
  state,
  setState
}: {
  icon: ImageSourcePropType;
  label: string;
  state: boolean;
  setState: (newState: boolean) => void;
}) => {
  return (
    <View className={"mb-3"}>
      <View className={"mb-1 flex-row"}>
        <View className={"flex-1 flex-row"}>
          <Image className={"my-auto mr-3 aspect-square w-8"} source={icon} />
          <Text className={"my-auto"} variant={"labelLarge"}>
            {label}
          </Text>
        </View>
        <Switch value={state} onValueChange={setState} />
      </View>
      <Divider />
    </View>
  );
};

export default NotificationSettingItem;
