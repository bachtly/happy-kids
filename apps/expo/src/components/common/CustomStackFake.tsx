import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { Text, TouchableRipple } from "react-native-paper";
import { View } from "react-native";

const CustomStackFake = (props: {
  title: string;
  left: React.ReactNode;
  leftButtonHandler?: () => void;
  right: React.ReactNode;
  rightButtonHandler?: () => void;
  textColor: string;
  bgColor: string;
}) => {
  return (
    <View
      className="flex h-14 w-full justify-center"
      style={{ backgroundColor: props.bgColor }}
    >
      <Text
        variant={"headlineSmall"}
        className="text-center"
        style={{ color: props.textColor }}
      >
        {props.title}
      </Text>
      <TouchableRipple
        className="absolute bottom-1/2 left-3 top-1/2 flex h-8 w-8 -translate-y-4 items-center justify-center rounded-full"
        borderless
        onPress={props.leftButtonHandler}
      >
        {props.left}
      </TouchableRipple>

      <TouchableRipple
        className="absolute bottom-1/2 right-3 top-1/2 flex h-8 w-8 -translate-y-4 items-center justify-center rounded-full"
        borderless
        onPress={props.rightButtonHandler}
      >
        {props.right}
      </TouchableRipple>
    </View>
  );
};

export default CustomStackFake;

export const CustomStackFakeDelete = (props: {
  numSelected: number;
  onBack?: () => void;
  onDelete?: () => void;
}) => {
  const bgColor = "white";
  const textColor = "black";
  return (
    <CustomStackFake
      bgColor={bgColor}
      textColor={textColor}
      left={<MaterialIcons name="arrow-back" color={textColor} size={24} />}
      right={<MaterialIcons name="delete" color={textColor} size={24} />}
      title={`Đã chọn ${props.numSelected} mục`}
      leftButtonHandler={props.onBack}
      rightButtonHandler={props.onDelete}
    />
  );
};

export const CustomStackFakeDone = (props: {
  title: string;
  onBack?: () => void;
  onDone?: () => void;
}) => {
  const bgColor = "white";
  const textColor = "black";
  return (
    <CustomStackFake
      bgColor={bgColor}
      textColor={textColor}
      left={<MaterialIcons name="close" color={textColor} size={24} />}
      right={<MaterialIcons name="check" color={textColor} size={24} />}
      title={props.title}
      leftButtonHandler={props.onBack}
      rightButtonHandler={props.onDone}
    />
  );
};
