import React, { useEffect, useState } from "react";
import { Text, useTheme, ProgressBar } from "react-native-paper";
import { Stack, useSearchParams } from "expo-router";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { ScrollView, View } from "react-native";
import PickupItem from "../../../src/components/pickup/PickupItem";
import { PickupItemModel } from "../../../src/models/PickupModels";
import { useIsFocused } from "@react-navigation/native";
import Body from "../../../src/components/Body";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";

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
    <Body>
      <Stack.Screen
        options={{
          title: "Đón về",
          animation: "slide_from_right"
        }}
      />
      {pickupMutation.isLoading && <ProgressBar indeterminate visible={true} />}

      <DateFilterBar time={time} setTime={setTime} />

      <ScrollView className={"p-2"}>
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
    </Body>
  );
};

export default HistoryScreen;
