import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold
} from "@expo-google-fonts/roboto";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { TRPCProvider } from "../src/utils/api";
import { AuthContextProvider } from "../src/utils/auth-context-provider";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#1750c9",
      accent: "#f1c40f"
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
                }
              }}
            />
          </PaperProvider>
        </SafeAreaProvider>
      </AuthContextProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
