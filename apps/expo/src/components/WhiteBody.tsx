import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

/// Should be used as the most outer body tab of every screen
const WhiteBody = (props: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <View className={"flex-1"} style={{ backgroundColor: colors.background }}>
      {props.children}
    </View>
  );
};

export default WhiteBody;
