import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { TRPCProvider } from "../src/utils/api";
import { AuthContextProvider } from "../src/utils/auth-context-provider";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#1750c9",
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
    }
  };

  return (
    <TRPCProvider>
      <AuthContextProvider>
        <SafeAreaProvider>
          {/*
          The Stack component displays the current page.
          It also allows you to configure your screens
        */}
          <StatusBar />
          <PaperProvider theme={theme}>
            <Stack
              screenOptions={{
                headerTintColor: theme.colors.background,
                headerStyle: {
                  backgroundColor: theme.colors.primary
                },
                statusBarColor: theme.colors.primary
              }}
              initialRouteName="temporary-dashboard"
            />
          </PaperProvider>
        </SafeAreaProvider>
      </AuthContextProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
