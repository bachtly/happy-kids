import { Text, View } from "react-native";
import React from "react";
import CustomStackScreen from "../../../src/components/CustomStackScreen";

const ForgetPasswordScreen = () => {
  return (
    <View>
      <CustomStackScreen title={"Quên mật khẩu"} />
      <Text>Forget pass word</Text>
    </View>
  );
};

export default ForgetPasswordScreen;
