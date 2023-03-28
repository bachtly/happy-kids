import { Stack, useNavigation, useRouter } from "expo-router";
import moment, { Moment } from "moment";

import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
  ProgressBar,
  Text,
  TouchableRipple,
  useTheme
} from "react-native-paper";
import { api } from "../../../utils/api";

import Icons from "react-native-vector-icons/AntDesign";
import Filter, { FilterType } from "../../medicine/segmentButtons/Filter";
import type { LeaveLetterItem } from "./LeaveLetterList";
import { LeaveLetterList } from "./LeaveLetterList";

const CheckOverlapMoment = (
  xFrom: Moment,
  xTo: Moment,
  yFrom: Moment,
  yTo: Moment
) => {
  const mxFrom = moment.max(xFrom, yFrom);
  const mnTo = moment.min(xTo, yTo);
  return mxFrom.isSameOrBefore(mnTo);
};

const LeaveLetterHomeView = ({
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
  const [filterValue, setFilterValue] = useState<FilterType>("All");
  const [medLetterList, setMedLetterList] = useState<LeaveLetterItem[]>([]);

  const { refetch, isFetching } = api.leaveletter.getLeaveLetterList.useQuery(
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
          setMedLetterList(
            resp.leaveLetterList
              .map((item) => ({
                id: item.id,
                reason: item.reason,
                createdAt: item.createdAt,
                status: item.status,
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
  const filteredMedLetList = medLetterList.filter((item) => {
    if (filterValue == "All") return true;
    const itemStartMoment = moment(item.startDate);
    const itemEndMoment = moment(item.endDate);
    if (filterValue == "Today")
      return CheckOverlapMoment(
        moment().startOf("day"),
        moment().startOf("day"),
        itemStartMoment,
        itemEndMoment
      );
    return CheckOverlapMoment(
      moment().startOf("day"),
      moment().startOf("day").add(7, "d"),
      itemStartMoment,
      itemEndMoment
    );
  });

  return (
    <View className="flex-1">
      {isFetching && <ProgressBar indeterminate visible={true} />}
      <View className="items-center">
        <Filter value={filterValue} setValue={setFilterValue} />
      </View>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <Stack.Screen
          options={{
            title: "Xin nghỉ",
            animation: "slide_from_right",
            headerRight: !isTeacher
              ? () => {
                  return (
                    <TouchableRipple
                      borderless
                      onPress={() => {
                        router.push({
                          pathname: "parent/leaveletter/add-letter-screen",
                          params: { studentId }
                        });
                      }}
                    >
                      <Icons name="plus" size={24} color="white" />
                    </TouchableRipple>
                  );
                }
              : undefined
          }}
        />
        <View className="px-4 pb-4">
          {filteredMedLetList.length > 0 ? (
            <LeaveLetterList isTeacher={isTeacher} items={filteredMedLetList} />
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
};

export default LeaveLetterHomeView;
