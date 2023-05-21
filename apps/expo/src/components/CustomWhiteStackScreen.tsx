import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "react-native-paper";

const CustomWhiteStackScreen = (props: { title: string }) => {
  const theme = useTheme();

  return (
    <Stack.Screen
      options={{
        title: props.title,
        animation: "slide_from_bottom",
        headerTitleAlign: "center",
        statusBarColor: theme.colors.onSurfaceDisabled,
        headerTintColor: theme.colors.onBackground,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: {
          fontFamily: theme.fonts.headlineSmall.fontFamily,
          fontSize: theme.fonts.headlineSmall.fontSize,
          fontWeight: theme.fonts.headlineSmall.fontWeight
        }
      }}
    />
  );
};

export default CustomWhiteStackScreen;
