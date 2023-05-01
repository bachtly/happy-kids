import React, { useEffect, useState } from "react";
import { Text, useTheme, ProgressBar } from "react-native-paper";
import { useSearchParams, useRouter } from "expo-router";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { ScrollView, View } from "react-native";
import PickupItem from "../../../src/components/pickup/PickupItem";
import { PickupItemModel } from "../../../src/models/PickupModels";
import { useIsFocused } from "@react-navigation/native";
import DateRangeFilterBar from "../../../src/components/date-picker/DateRangeFilterBar";
import Body from "../../../src/components/Body";
import CustomStack from "../../../src/components/CustomStackScreen";
import AlertModal from "../../../src/components/common/AlertModal";

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
  const [errorMessage, setErrorMessage] = useState("");

  // data
  const [pickupList, setPickupList] = useState<PickupItemModel[]>([]);

  const pickupMutation = api.pickup.getPickupList.useMutation({
    onSuccess: (resp) => setPickupList(resp.pickups),
    onError: (e) => setErrorMessage(e.message)
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
        <CustomStack
          title={"Đón về"}
          addButtonHandler={() => {
            router.push({
              pathname: "parent/pickup/add-pickup-screen",
              params: { studentId: studentIdSaved }
            });
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
            <View className={"mb-10 mt-5"}>
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

        <AlertModal
          visible={errorMessage != ""}
          title={"Thông báo"}
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      </Body>
    </>
  );
};

export default HistoryScreen;
