import React, { useEffect, useState } from "react";
import { Text, useTheme } from "react-native-paper";
import { Stack, useSearchParams } from "expo-router";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { Pressable, ScrollView, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import PickupItem from "../../../src/components/pickup/PickupItem";
import { PickupItemModel } from "../../../src/models/PickupModels";
import DatePicker from "../../../src/components/DatePicker";
import { useIsFocused } from "@react-navigation/native";

const DEFAULT_TIME = moment(moment.now());

const HistoryScreen = () => {
  const { colors } = useTheme();
  const { classId } = useSearchParams();
  const isFocused = useIsFocused();

  // states
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  // data
  const [classIdSaved, setClassIdSaved] = useState("");
  const [pickupList, setPickupList] = useState<PickupItemModel[]>([]);

  const pickupMutation = api.pickup.getPickupListFromClassId.useMutation({
    onSuccess: (resp) => setPickupList(resp.pickups)
  });

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    classId && setClassIdSaved(classId);
  }, [classId]);

  // update list when search criterias change
  useEffect(() => {
    pickupMutation.mutate({
      time: time.toDate(),
      classId: classIdSaved ?? ""
    });
  }, [classIdSaved, time, isFocused]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Đón về",
          animation: "slide_from_right"
        }}
      />

      <View className={"flex-1 bg-white px-2"}>
        <View className={"fixed my-4 flex-row justify-between"}>
          <View className={""}>
            <DatePicker initTime={time} setTime={setTime} />
          </View>

          <View className={"flex-row justify-between space-x-4"}>
            <Pressable className={""}>
              <View className={"m-auto"}>
                <AntDesign name={"filter"} size={25}></AntDesign>
              </View>
            </Pressable>
          </View>
        </View>

        <ScrollView>
          {pickupList != null && pickupList.length > 0 ? (
            pickupList.map((item, key) => (
              <PickupItem key={key} item={item} isTeacher={true} />
            ))
          ) : (
            <View className={"mt-5 mb-10"}>
              <Text
                className={"text-center"}
                variant={"titleLarge"}
                style={{ color: colors.onSurfaceDisabled }}
              >
                Không có dữ liệu để hiển thị
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default HistoryScreen;
