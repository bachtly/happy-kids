import { Stack } from "expo-router";
import Icons from "react-native-vector-icons/AntDesign";
import React from "react";
import { TouchableRipple, useTheme } from "react-native-paper";

const CustomStackScreen = (props: {
  title: string;
  addButtonHandler?: () => void;
}) => {
  const theme = useTheme();

  return (
    <Stack.Screen
      options={{
        title: props.title,
        animation: "slide_from_right",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: theme.fonts.headlineSmall.fontFamily,
          fontSize: theme.fonts.headlineSmall.fontSize,
          fontWeight: theme.fonts.headlineSmall.fontWeight
        },
        headerRight: props.addButtonHandler
          ? () => {
              return (
                <TouchableRipple borderless onPress={props.addButtonHandler}>
                  <Icons name="plus" size={24} color="white" />
                </TouchableRipple>
              );
            }
          : undefined
      }}
    />
  );
};

export default CustomStackScreen;
