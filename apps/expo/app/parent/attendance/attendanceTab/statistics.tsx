import * as NavigationBar from "expo-navigation-bar";
import { useRouter } from "expo-router";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { List, useTheme } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import DatePicker from "../../../../src/components/DatePicker";
import { AttendanceStatisticsModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { useAuthContext } from "../../../../src/utils/auth-context-provider";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const AttendanceStatistics = () => {
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
  const [statistics, setStatistics] =
    useState<AttendanceStatisticsModel | null>(null);
  const attMutation = api.attendance.getAttendanceStatistics.useMutation({
    onSuccess: (resp) => setStatistics(resp.statistics)
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
    <View className={"flex-1 bg-white px-2"}>
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
        <List.Item
          title={`Đã điểm danh: ${
            (statistics?.CheckedIn as unknown as string) ?? "0"
          }`}
          // description="Item description"
          left={() => (
            <View className={"m-auto ml-5"}>
              <FontAwesomeIcon name={"circle"} size={15}></FontAwesomeIcon>
            </View>
          )}
        />
        <List.Item
          title={`Vắng có phép: ${
            (statistics?.AbsenseWithPermission as unknown as string) ?? "0"
          }`}
          // description="Item description"
          left={() => (
            <View className={"m-auto ml-5"}>
              <FontAwesomeIcon name={"circle"} size={15}></FontAwesomeIcon>
            </View>
          )}
        />
        <List.Item
          title={`Vắng không phép: ${
            (statistics?.AbsenseWithoutPermission as unknown as string) ?? "0"
          }`}
          // description="Item description"
          left={() => (
            <View className={"m-auto ml-5"}>
              <FontAwesomeIcon name={"circle"} size={15}></FontAwesomeIcon>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default AttendanceStatistics;