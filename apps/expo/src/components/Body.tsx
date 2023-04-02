import React from "react";
import { View } from "react-native";

/// Should be used as the most outer body tab of every screen
const Body = (props: { children: React.ReactNode }) => {
  return <View className={"flex-1 bg-gray-50"}>{props.children}</View>;
};

export default Body;
