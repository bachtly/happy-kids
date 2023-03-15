import { Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";

const ForgetPasswordScreen = () => {
  return (
    <View>
      <Stack.Screen options={{ title: "Quên mật khẩu" }} />
      <Text>Forget pass word</Text>
    </View>
  );
};

export default ForgetPasswordScreen;
