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
import { FilterType } from "../Filter";
import type { MedLetterItem } from "./MedicineLetterList";
import { MedicineLetterList } from "./MedicineLetterList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

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
      <Stack.Screen
        options={{
          title: "Dặn thuốc",
          animation: "slide_from_right",
          headerRight: !isTeacher
            ? () => {
                return (
                  <TouchableRipple
                    borderless
                    onPress={() => {
                      router.push({
                        pathname: "parent/medicine/add-letter-screen",
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

export default MedicineHomeView;
