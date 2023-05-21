import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts
} from "react-native-paper";
import { TRPCProvider } from "../src/utils/api";
import { AuthContextProvider } from "../src/utils/auth-context-provider";
import { ErrorContextProvider } from "../src/utils/error-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
void SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      ...themeColors
    },
    fonts: {
      ...DefaultTheme.fonts,
      ...configureFonts({ config: fontConfig })
    }
  };

  const [fontsLoaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Quicksand_Bold: require("assets/fonts/QuickSand/Quicksand-Bold.ttf"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Quicksand_SemiBold: require("assets/fonts/QuickSand/Quicksand-SemiBold.ttf"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Quicksand_Medium: require("assets/fonts/QuickSand/Quicksand-Medium.ttf")
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <SafeAreaProvider onLayout={() => void onLayoutRootView()}>
        {/*
        The Stack component displays the current page.
        It also allows you to configure your screens
      */}
        <StatusBar />
        <PaperProvider theme={theme}>
          <AuthContextProvider>
            <ErrorContextProvider>
              <Stack
                screenOptions={{
                  headerTintColor: theme.colors.background,
                  headerStyle: {
                    backgroundColor: theme.colors.primary
                  },
                  statusBarColor: theme.colors.primary
                }}
                initialRouteName="login/login-screen"
              />
            </ErrorContextProvider>
          </AuthContextProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default RootLayout;

const fontConfig = {
  headlineSmall: {
    fontFamily: "Quicksand_SemiBold",
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 32
  },
  titleLarge: {
    fontFamily: "Quicksand_SemiBold",
    fontSize: 18,
    letterSpacing: 0.15,
    lineHeight: 24
  },
  titleMedium: {
    fontFamily: "Quicksand_SemiBold",
    fontSize: 16
  },
  titleSmall: {
    fontFamily: "Quicksand_SemiBold",
    fontSize: 14
  },
  labelLarge: {
    fontFamily: "Quicksand_SemiBold",
    fontSize: 14
  },
  labelMedium: {
    fontFamily: "Quicksand_SemiBold",
    fontSize: 12
  },
  bodyLarge: {
    fontFamily: "Quicksand_Medium",
    fontSize: 14
  },
  bodyMedium: {
    fontFamily: "Quicksand_Medium",
    fontSize: 14
  },
  bodySmall: {
    fontFamily: "Quicksand_Medium",
    fontSize: 12
  },
  default: {
    fontFamily: "Quicksand_Medium",
    fontSize: 14
  }
};

const themeColors = {
  primary: "#00A0D9",
  secondary: "#f1c40f",
  outline: "#b1c6d5",
  background: "#fff",
  surface: "#fff",
  elevation: {
    ...DefaultTheme.colors.elevation,
    level3: "#fff"
  },
  surfaceDisabled: "#e8f0f5",
  tertiary: "#00ab68"
};
