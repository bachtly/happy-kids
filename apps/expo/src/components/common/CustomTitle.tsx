import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import React from "react";

const CustomTitle = ({ title }: { title: string }) => {
  const { colors } = useTheme();

  return (
    <View className={"px-3"} style={{ backgroundColor: colors.background }}>
      <View className={"pb-3 pt-3"}>
        <Text
          className={""}
          variant={"titleMedium"}
          style={{ color: colors.primary }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default CustomTitle;
