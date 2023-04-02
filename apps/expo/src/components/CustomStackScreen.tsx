import { Stack } from "expo-router";
import Icons from "react-native-vector-icons/AntDesign";
import React from "react";
import { TouchableRipple } from "react-native-paper";

const CustomStackScreen = (props: {
  title: string;
  addButtonHandler?: () => void;
}) => {
  return (
    <Stack.Screen
      options={{
        title: props.title,
        animation: "slide_from_right",
        headerRight: props.addButtonHandler
          ? () => {
              return (
                <TouchableRipple borderless onPress={props.addButtonHandler}>
                  <Icons name="plus" size={24} color="white" />
                </TouchableRipple>
              );
            }
          : undefined
      }}
    />
  );
};

export default CustomStackScreen;
