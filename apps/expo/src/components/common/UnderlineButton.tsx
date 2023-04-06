import React from "react";
import { Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
const UnderlineButton = (props: {
  onPress: () => void;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <Text
          className="text-center text-xs font-bold"
          style={{
            ...(pressed ? { textDecorationLine: "underline" } : {}),
            color: theme.colors.primary
          }}
        >
          {props.children}
        </Text>
      )}
    </Pressable>
  );
};
export default UnderlineButton;
