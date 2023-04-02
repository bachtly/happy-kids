import React, { useEffect, useState } from "react";
import {
  TouchableRipple,
  Text,
  useTheme,
  ProgressBar
} from "react-native-paper";
import { Stack, useSearchParams, useRouter } from "expo-router";
import Icons from "react-native-vector-icons/AntDesign";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { ScrollView, View } from "react-native";
import PickupItem from "../../../src/components/pickup/PickupItem";
import { PickupItemModel } from "../../../src/models/PickupModels";
import { useIsFocused } from "@react-navigation/native";
import DateRangeFilterBar from "../../../src/components/date-picker/DateRangeFilterBar";
import Body from "../../../src/components/Body";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const HistoryScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { studentId } = useSearchParams();
  const isFocused = useIsFocused();

  // states
  const [studentIdSaved, setStudentIdSaved] = useState("");
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  // data
  const [pickupList, setPickupList] = useState<PickupItemModel[]>([]);

  const pickupMutation = api.pickup.getPickupList.useMutation({
    onSuccess: (resp) => setPickupList(resp.pickups)
  });

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    studentId && setStudentIdSaved(studentId);
  }, [studentId]);

  // update list when search criterias change
  useEffect(() => {
    pickupMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  }, [studentId, timeStart, timeEnd, isFocused]);

  return (
    <>
      <Body>
        <Stack.Screen
          options={{
            title: "Đón về",
            animation: "slide_from_right",
            headerRight: () => {
              return (
                <TouchableRipple
                  borderless
                  onPress={() => {
                    router.push({
                      pathname: "parent/pickup/add-pickup-screen",
                      params: { studentId: studentIdSaved }
                    });
                  }}
                >
                  <Icons name="plus" size={24} color="white" />
                </TouchableRipple>
              );
            }
          }}
        />
        {pickupMutation.isLoading && (
          <ProgressBar indeterminate visible={true} />
        )}

        <DateRangeFilterBar
          timeStart={timeStart}
          setTimeStart={setTimeStart}
          timeEnd={timeEnd}
          setTimeEnd={setTimeEnd}
        />

        <ScrollView className={"p-2"}>
          {pickupList != null && pickupList.length > 0 ? (
            pickupList.map((item, key) => (
              <PickupItem key={key} item={item} isTeacher={false} />
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
    </>
  );
};

export default HistoryScreen;
