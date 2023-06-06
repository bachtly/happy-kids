import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableRipple, useTheme } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CustomWhiteStackScreen = (props: {
  title: string;
  rightButtonHandler?: () => void;
  backButtonHandler?: () => void;
}) => {
  const router = useRouter();
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
        headerRight: props.rightButtonHandler
          ? () => {
              return (
                <TouchableRipple
                  className="mt-1"
                  borderless
                  onPress={props.rightButtonHandler}
                >
                  <Ionicons
                    name={"send-sharp"}
                    size={24}
                    color={theme.colors.onPrimary}
                    onPress={() => {
                      props.rightButtonHandler && props.rightButtonHandler();
                    }}
                  />
                </TouchableRipple>
              );
            }
          : undefined,
        headerLeft: (_) => (
          <TouchableRipple
            className="mt-1"
            borderless
            onPress={props.backButtonHandler ?? (() => router.back())}
          >
            <MaterialIcons
              name="arrow-back"
              color={theme.colors.onPrimary}
              size={24}
            />
          </TouchableRipple>
        )
      }}
    />
  );
};

export default CustomWhiteStackScreen;
