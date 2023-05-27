import { Stack } from "expo-router";
import Icons from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { TouchableRipple, useTheme } from "react-native-paper";

const CustomStackScreen = (props: {
  title: string;
  addButtonHandler?: () => void;
  backButtonHandler?: () => void;
}) => {
  const theme = useTheme();
  const textColor = theme.colors.onPrimary;
  const [bgColor, statusColor] = [theme.colors.primary, theme.colors.primary];

  return (
    <Stack.Screen
      options={{
        title: props.title,
        animation: "slide_from_right",
        headerTitleAlign: "center",
        statusBarColor: statusColor,
        headerStyle: { backgroundColor: bgColor },
        headerTitleStyle: {
          fontFamily: theme.fonts.headlineSmall.fontFamily,
          fontSize: theme.fonts.headlineSmall.fontSize,
          fontWeight: theme.fonts.headlineSmall.fontWeight
        },
        headerRight: props.addButtonHandler
          ? () => {
              return (
                <TouchableRipple
                  className="absolute bottom-1/2 right-0 top-1/2 flex h-8 w-8 -translate-y-4 translate-x-1 items-center justify-center rounded-full"
                  borderless
                  onPress={props.addButtonHandler}
                >
                  <Icons name="plus" size={24} color={textColor} />
                </TouchableRipple>
              );
            }
          : undefined,
        headerLeft: props.backButtonHandler
          ? () => (
              <TouchableRipple
                className="absolute bottom-1/2 left-0 top-1/2 flex h-8 w-8 -translate-x-1 -translate-y-4 items-center justify-center rounded-full"
                borderless
                onPress={props.backButtonHandler}
              >
                <MaterialIcons name="arrow-back" color={textColor} size={24} />
              </TouchableRipple>
            )
          : undefined
      }}
    />
  );
};

export default CustomStackScreen;
