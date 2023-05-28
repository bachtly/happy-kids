import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import React, { ReactNode } from "react";

const CustomTitle = ({
  title,
  rightButton
}: {
  title: string;
  rightButton?: ReactNode;
}) => {
  const { colors } = useTheme();

  return (
    <View
      className={"flex-row items-center justify-between px-3"}
      style={{ backgroundColor: colors.background }}
    >
      <View className={"pb-3 pt-3"}>
        <Text
          className={""}
          variant={"titleMedium"}
          style={{ color: colors.primary }}
        >
          {title}
        </Text>
      </View>
      {rightButton && <View>{rightButton}</View>}
    </View>
  );
};

export default CustomTitle;
