import { useNavigation, useRouter } from "expo-router";
import moment, { Moment } from "moment";

import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ProgressBar, Text, useTheme } from "react-native-paper";
import { api } from "../../../utils/api";

import type { MedLetterItem } from "./MedicineLetterList";
import { MedicineLetterList } from "./MedicineLetterList";
import CustomStackScreen from "../../CustomStackScreen";
import DateRangeFilterBar from "../../date-picker/DateRangeFilterBar";

const CheckOverlapDate = (
  xFrom: Moment,
  xTo: Moment,
  yFrom: Moment,
  yTo: Moment
) => {
  const mxFrom = moment.max(xFrom.startOf("day"), yFrom.startOf("day"));
  const mnTo = moment.min(xTo.startOf("day"), yTo.startOf("day"));
  return mxFrom.isSameOrBefore(mnTo);
};

const MedicineHomeView = ({
  isTeacher,
  classId,
  studentId
}: {
  isTeacher: boolean;
  classId: string;
  studentId: string;
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [letterList, setLetterList] = useState<MedLetterItem[]>([]);

  const DEFAULT_TIME_END = moment().startOf("day");
  const DEFAULT_TIME_START = moment().startOf("day").add(7, "d");

  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  const { refetch, isFetching } = api.medicine.getMedicineLetterList.useQuery(
    isTeacher
      ? {
          classId
        }
      : {
          studentId
        },
    {
      onSuccess: (resp) => {
        if (resp.status !== "Success") {
          console.log(resp.message);
        } else {
          setLetterList(
            resp.medicineLetterList
              .map((item) => ({
                id: item.id,
                createdAt: item.createdAt,
                status: item.status,
                isUsed: item.isUsed,
                note: item.note,
                startDate: item.startDate,
                endDate: item.endDate,
                studentName: item.studentName
              }))
              .sort((item1, item2) =>
                moment(item2.createdAt).diff(moment(item1.createdAt))
              )
          );
        }
      }
    }
  );

  // fetch data when focus
  const navigation = useNavigation();
  const fetchData = () => {
    refetch().catch((e: Error) => {
      console.log(e.message);
    });
  };
  useEffect(() => {
    const focusListener = navigation.addListener("focus", fetchData);
    return focusListener;
  }, []);

  // update list on filter change
  const getFilteredLetList = () =>
    letterList.filter((item) => {
      const itemStartMoment = moment(item.startDate);
      const itemEndMoment = moment(item.endDate);
      return CheckOverlapDate(
        timeStart,
        timeEnd,
        itemStartMoment,
        itemEndMoment
      );
    });

  const ListComponent = ({
    filteredLetList
  }: {
    filteredLetList: MedLetterItem[];
  }) => (
    <View className="flex-1">
      {isFetching && <ProgressBar indeterminate visible={true} />}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <View className="px-4 pt-4">
          {filteredLetList.length > 0 ? (
            <MedicineLetterList isTeacher={isTeacher} items={filteredLetList} />
          ) : (
            <View
              className="rounded-sm border p-4"
              style={{ borderColor: theme.colors.outline }}
            >
              <Text className={"text-center leading-6"}>
                Danh sách đơn trống.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1">
      <CustomStackScreen
        title={"Dặn thuốc"}
        addButtonHandler={
          isTeacher
            ? undefined
            : () => {
                router.push({
                  pathname: "parent/medicine/add-letter-screen",
                  params: { studentId }
                });
              }
        }
      />
      <DateRangeFilterBar
        timeStart={timeStart}
        timeEnd={timeEnd}
        setTimeStart={setTimeStart}
        setTimeEnd={setTimeEnd}
      />
      <ListComponent filteredLetList={getFilteredLetList()} />
    </View>
  );
};

export default MedicineHomeView;
