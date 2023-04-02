import { useNavigation, useRouter } from "expo-router";
import moment, { Moment } from "moment";

import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ProgressBar, Text, useTheme } from "react-native-paper";
import { api } from "../../../utils/api";

import { FilterType } from "../../medicine/Filter";
import type { LeaveLetterItem } from "./LeaveLetterList";
import { LeaveLetterList } from "./LeaveLetterList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CustomStackScreen from "../../CustomStackScreen";

const Tab = createMaterialTopTabNavigator();

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
  const [letterList, setLetterList] = useState<LeaveLetterItem[]>([]);

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
          setLetterList(
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
  const getFilteredLetList = (filterValue: FilterType) =>
    letterList.filter((item) => {
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

  const ListComponent = ({
    filteredLetList
  }: {
    filteredLetList: LeaveLetterItem[];
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
            <LeaveLetterList isTeacher={isTeacher} items={filteredLetList} />
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
        title={"Xin nghỉ"}
        addButtonHandler={
          isTeacher
            ? undefined
            : () => {
                router.push({
                  pathname: "parent/leaveletter/add-letter-screen",
                  params: { studentId }
                });
              }
        }
      />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.colors.primary },
          tabBarActiveTintColor: theme.colors.onPrimary,
          tabBarLabelStyle: {
            textTransform: "capitalize"
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.onPrimary
          }
        }}
      >
        <Tab.Screen
          name={"Tất cả"}
          children={() => (
            <ListComponent filteredLetList={getFilteredLetList("All")} />
          )}
        />
        <Tab.Screen
          name={"Hôm nay"}
          children={() => (
            <ListComponent filteredLetList={getFilteredLetList("Today")} />
          )}
        />
        <Tab.Screen
          name={"7 ngày tới"}
          children={() => (
            <ListComponent filteredLetList={getFilteredLetList("7days")} />
          )}
        />
      </Tab.Navigator>
    </View>
  );
};

export default LeaveLetterHomeView;
