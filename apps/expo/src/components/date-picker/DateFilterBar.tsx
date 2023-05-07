import { Pressable, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import React from "react";
import { Moment } from "moment";
import { Divider } from "react-native-paper";
import DatePicker from "./DatePicker";

const DateFilterBar = (props: {
  time: Moment;
  setTime: (d: Moment) => void;
}) => {
  return (
    <>
      <View className={"fixed flex-row justify-between bg-white px-4 py-4"}>
        <View className={""}>
          <DatePicker initTime={props.time} setTime={props.setTime} />
        </View>

        <View className={"flex-row justify-between space-x-4"}>
          <Pressable className={""}>
            <View className={"m-auto"}>
              <AntDesign name={"filter"} size={25}></AntDesign>
            </View>
          </Pressable>
        </View>
      </View>
      <Divider />
    </>
  );
};

export default DateFilterBar;
