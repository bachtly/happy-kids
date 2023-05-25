import { View } from "react-native";
import React from "react";
import { Avatar, Text } from "react-native-paper";
import defaultAvatar from "../../../assets/images/default-user-avatar.png";

const UserWithAvatar = ({
  avatar,
  name,
  extraInfo,
  rightButton
}: {
  avatar?: string | null;
  name: string;
  extraInfo: string;
  rightButton?: React.ReactNode;
}) => {
  return (
    <View className={"flex-1 flex-row justify-between"}>
      <View className={"mb-2 flex-1 flex-row space-x-2"}>
        <Avatar.Image
          className={"my-auto"}
          size={42}
          source={
            avatar ? { uri: `data:image/jpeg;base64,${avatar}` } : defaultAvatar
          }
        />
        <View>
          <Text className={""} variant={"titleSmall"}>
            {name}
          </Text>
          <Text className={""} variant={"bodyMedium"}>
            {extraInfo}
          </Text>
        </View>
      </View>
      <View>{rightButton}</View>
    </View>
  );
};

export default UserWithAvatar;
