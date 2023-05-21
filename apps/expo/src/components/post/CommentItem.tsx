import { View } from "react-native";
import React from "react";
import { Avatar, useTheme, Text } from "react-native-paper";
import { CommentModel } from "../../models/PostModels";
import moment from "moment";

const CommentItem = ({ item }: { item: CommentModel }) => {
  const { colors } = useTheme();

  return (
    <View className={"flex-row space-x-2"}>
      <Avatar.Image
        className={""}
        size={42}
        source={{
          uri: `data:image/jpeg;base64,${item.userAvatar ?? ""}`
        }}
      />
      <View className={"flex-1"}>
        <View
          className={"border-solid"}
          style={{
            borderColor: colors.outline,
            borderWidth: 1,
            borderRadius: 8,
            paddingTop: 4,
            paddingBottom: 6,
            paddingLeft: 8,
            marginBottom: 2
          }}
        >
          <Text variant={"labelLarge"}>{item.userFullname}</Text>
          <Text variant={"bodyMedium"}>{item.content}</Text>
        </View>

        {item.time && (
          <Text className={""} variant={"bodySmall"} style={{ paddingLeft: 8 }}>
            {moment(item.time).format("HH:mm DD/MM/YY")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CommentItem;
