import { Pressable, View } from "react-native";
import DateRangePicker from "./DateRangePicker";
import AntDesign from "react-native-vector-icons/AntDesign";
import React from "react";
import { Moment } from "moment";
import { Divider } from "react-native-paper";

const DateRangeFilterBar = (props: {
  timeStart: Moment;
  setTimeStart: (d: Moment) => void;
  timeEnd: Moment;
  setTimeEnd: (d: Moment) => void;
}) => {
  return (
    <>
      <View className={"fixed flex-row justify-between bg-white px-4 py-4"}>
        <View className={""}>
          <DateRangePicker
            initTimeStart={props.timeStart}
            initTimeEnd={props.timeEnd}
            setTimeStart={props.setTimeStart}
            setTimeEnd={props.setTimeEnd}
          />
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

export default DateRangeFilterBar;
