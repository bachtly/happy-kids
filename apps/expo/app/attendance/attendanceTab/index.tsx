import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import {Pressable, ScrollView, View} from "react-native";
import { Text, useTheme, Button, Portal } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import AttendanceItem, {
  AttendanceItemProps
} from "../../../src/components/attendance/AttendanceItem";
import DatePicker from "../../../src/components/DatePicker";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import {useRouter} from "expo-router"

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const AttendanceHistory = () => {
  // properties
  const { colors } = useTheme();
  const { studentId } = useAuthContext();
  const vis = NavigationBar.useVisibility();
  const router = useRouter();

  // states
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  const [filter, setFilter] = useState({
    searchStr: "",
    status: ""
  });

  // data
  const [attendanceList, setAttendanceList] = useState<AttendanceItemProps[]>(
    []
  );
  const attMutation = api.attendance.getAttendanceList.useMutation({
    onSuccess: (resp) => setAttendanceList(resp.attendances)
  });

  // update list when search criterias change
  useEffect(() => {
    attMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  }, [timeStart, timeEnd, filter]);

  return (
    <View className={"bg-white px-2"}>
      <View className={"fixed my-4 flex-row justify-between"}>
        <View className={""}>
          <DatePicker
            initTimeStart={timeStart}
            initTimeEnd={(() => timeEnd)()}
            setTimeStart={setTimeStart}
            setTimeEnd={setTimeEnd}
            useRange={true}
          />
        </View>

        <View className={"flex-row justify-between space-x-4"}>
          <Pressable className={""}>
            <View className={"m-auto"}>
              <AntDesign name={"search1"} size={25}></AntDesign>
            </View>
          </Pressable>

          <Pressable className={""}>
            <View className={"m-auto"}>
              <AntDesign name={"filter"} size={25}></AntDesign>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView>
        {attendanceList != null && attendanceList.length > 0 ? (
          attendanceList.map((item, key) => (
            <AttendanceItem key={key} {...item} />
          ))
        ) : (
          <View className={"mt-5 mb-10"}>
            <Text
              className={"text-center"}
              variant={"titleLarge"}
              style={{ color: colors.gray }}
            >
              Không có dữ liệu để hiển thị
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default AttendanceHistory