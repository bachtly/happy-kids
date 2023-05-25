import { Stack } from "expo-router";
import React from "react";
import { TouchableRipple, useTheme } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

const CustomWhiteStackScreen = (props: {
  title: string;
  addButtonHandler?: () => void;
}) => {
  const theme = useTheme();

  return (
    <Stack.Screen
      options={{
        title: props.title,
        animation: "slide_from_bottom",
        headerTitleAlign: "center",
        statusBarColor: theme.colors.onSurfaceDisabled,
        headerTintColor: theme.colors.onPrimary,
        headerStyle: { backgroundColor: theme.colors.tertiary },
        headerTitleStyle: {
          fontFamily: theme.fonts.headlineSmall.fontFamily,
          fontSize: theme.fonts.headlineSmall.fontSize,
          fontWeight: theme.fonts.headlineSmall.fontWeight
        },
        headerShadowVisible: false,
        headerRight: props.addButtonHandler
          ? () => {
              return (
                <TouchableRipple borderless onPress={props.addButtonHandler}>
                  <Ionicons
                    name={"send-sharp"}
                    size={24}
                    color={theme.colors.onPrimary}
                    style={{ paddingTop: 8 }}
                    onPress={() => {
                      props.addButtonHandler && props.addButtonHandler();
                    }}
                  />
                </TouchableRipple>
              );
            }
          : undefined
      }}
    />
  );
};

export default CustomWhiteStackScreen;
