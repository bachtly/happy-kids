import { View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import PieChart from "react-native-pie-chart";

const StatisticsChart = ({ series }: { series: number[] }) => {
  const sliceColos = ["#4FB477", "#f1c40f", "#EE6352"];
  const texts = ["Có đi học", "Vắng có phép", "Vắng không phép"];

  const sum = (nums: number[]) => {
    return nums.reduce((sum, current) => sum + current, 0);
  };

  const LegendItem = ({
    text,
    val,
    ratio,
    color
  }: {
    text: string;
    val: number;
    ratio: number;
    color: string;
  }) => (
    <View className={"mb-0.5 flex-row justify-between"}>
      <View className={"flex-1"}>
        <Text style={{ color: color }}>{text}</Text>
      </View>
      <View className={"mr-2 w-10"}>
        <Text className={"text-right"}>{val}</Text>
      </View>
      <View className={"w-10"}>
        <Text className={"text-right"}>{Math.round(ratio)}%</Text>
      </View>
    </View>
  );

  if (sum(series) == 0) return <></>;

  return (
    <View className={"flex-row space-x-4"}>
      <PieChart
        widthAndHeight={100}
        series={series}
        sliceColor={sliceColos}
        coverRadius={0.45}
        coverFill={"#FFF"}
      />
      <View className={"flex-1 flex-col justify-start"}>
        <View className={"mb-0.5 flex-row justify-between"}>
          <View className={"flex-1"}></View>
          <View className={"mr-2 w-10"}>
            <Text className={"text-right"}>Ngày</Text>
          </View>
          <View className={"w-10"}>
            <Text className={"text-right"}>Tỉ lệ</Text>
          </View>
        </View>
        {texts.map((val, key) => {
          return (
            <LegendItem
              key={key}
              text={val}
              color={sliceColos[key]}
              val={series[key]}
              ratio={(series[key] * 100) / sum(series)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default StatisticsChart;
