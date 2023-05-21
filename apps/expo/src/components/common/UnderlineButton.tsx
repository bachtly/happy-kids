import React from "react";
import { Pressable, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const UnderlineButton = (props: {
  icon?: string;
  onPress: () => void;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View className={"flex-row space-x-1"}>
          {props.icon && (
            <Icon name={props.icon} size={22} color={theme.colors.primary} />
          )}
          <Text
            className="m-auto text-center"
            variant={"labelMedium"}
            style={{
              ...(pressed ? { textDecorationLine: "underline" } : {}),
              color: theme.colors.primary
            }}
          >
            {props.children}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
export default UnderlineButton;
