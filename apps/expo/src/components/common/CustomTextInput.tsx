import React from "react";
import { TextInput } from "react-native-paper";

const CustomTextInput = ({
  placeholder,
  value,
  setValue
}: {
  placeholder: string;
  value: string;
  setValue: (input: string) => void;
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      mode={"outlined"}
      multiline
      onChangeText={(input) => setValue(input)}
      value={value}
    />
  );
};

export default CustomTextInput;
