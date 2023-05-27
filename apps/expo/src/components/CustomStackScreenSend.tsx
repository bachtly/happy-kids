import { Stack } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { View } from "react-native";

const CustomStackScreenSend = () => {
  const theme = useTheme();
  const statusColor = theme.colors.onSurfaceDisabled;

  return (
    <Stack.Screen
      options={{
        statusBarColor: statusColor
      }}
    />
  );
};

export default CustomStackScreenSend;

export const CustomStackScreenSendFake = (props: {
  title: string;
  sendButtonHandler?: () => void;
  backButtonHandler?: () => void;
}) => {
  const theme = useTheme();
  const textColor = theme.colors.onPrimary;
  const bgColor = theme.colors.tertiary;

  return (
    <View
      className="flex h-14 w-full justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <Text
        variant={"headlineSmall"}
        className="text-center"
        style={{ color: textColor }}
      >
        {props.title}
      </Text>
      <TouchableRipple
        className="absolute bottom-1/2 left-3 top-1/2 flex h-8 w-8 -translate-y-4 items-center justify-center rounded-full"
        borderless
        onPress={props.backButtonHandler}
      >
        <MaterialIcons name="arrow-back" color={textColor} size={24} />
      </TouchableRipple>

      <TouchableRipple
        className="absolute bottom-1/2 right-3 top-1/2 flex h-8 w-8 -translate-y-4 items-center justify-center rounded-full"
        borderless
        onPress={props.sendButtonHandler}
      >
        <Ionicons name={"send-sharp"} size={20} color={textColor} />
      </TouchableRipple>
    </View>
  );
};
