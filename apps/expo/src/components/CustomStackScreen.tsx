import { Stack, useRouter } from "expo-router";
import Icons from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React, { ReactNode } from "react";
import { TouchableRipple, useTheme } from "react-native-paper";

const CustomStackScreen = (props: {
  title: string;
  rightButtonHandler?: () => void;
  headerRight?: ReactNode;
  backButtonHandler?: () => void;
  hideBackButton?: boolean;
}) => {
  const router = useRouter();
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
        headerBackVisible: false,
        headerStyle: { backgroundColor: bgColor },
        headerTitleStyle: {
          fontFamily: theme.fonts.headlineSmall.fontFamily,
          fontSize: theme.fonts.headlineSmall.fontSize,
          fontWeight: theme.fonts.headlineSmall.fontWeight
        },
        headerRight: props.rightButtonHandler
          ? () => {
              return (
                props.headerRight ?? (
                  <TouchableRipple
                    className="absolute bottom-1/2 right-0 top-1/2 flex h-8 w-8 -translate-y-4 translate-x-1 items-center justify-center rounded-full"
                    borderless
                    onPress={props.rightButtonHandler}
                  >
                    <Icons name="plus" size={24} color={textColor} />
                  </TouchableRipple>
                )
              );
            }
          : undefined,
        headerLeft: props.hideBackButton
          ? undefined
          : (_) => (
              <TouchableRipple
                className="mt-1"
                borderless
                onPress={props.backButtonHandler ?? (() => router.back())}
              >
                <MaterialIcons name="arrow-back" color={textColor} size={24} />
              </TouchableRipple>
            )
      }}
    />
  );
};

export default CustomStackScreen;
