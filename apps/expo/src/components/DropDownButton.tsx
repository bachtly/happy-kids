import { Pressable, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

const DropDownButton = ({
  classNameStr,
  onPress,
  children
}: {
  classNameStr: string;
  onPress: () => void;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      className={classNameStr}
      onPress={() => onPress()}
      style={{ backgroundColor: colors.background }}
    >
      <View
        className={"flex-row justify-between p-2"}
        style={{ borderWidth: 0.5, borderRadius: 6 }}
      >
        <Text>{children}</Text>
        <AntDesign name={"down"} size={15} style={{ alignSelf: "center" }} />
      </View>
    </Pressable>
  );
};

export default DropDownButton;
