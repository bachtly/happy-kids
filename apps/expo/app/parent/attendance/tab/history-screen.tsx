import moment, { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import AttendanceItem from "../../../../src/components/attendance/AttendanceItem";
import {
  AttendanceItemModel,
  AttendanceStatisticsModel
} from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import Body from "../../../../src/components/Body";
import DateRangeFilterBar from "../../../../src/components/date-picker/DateRangeFilterBar";
import { useIsFocused } from "@react-navigation/native";
import StatisticsChart from "../../../../src/components/attendance/StatisticsChart";
import { trpcErrorHandler } from "../../../../src/utils/trpc-error-handler";
import { useAuthContext } from "../../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../../src/utils/error-context";
import CustomCard from "../../../../src/components/CustomCard";
import CustomTitle from "../../../../src/components/common/CustomTitle";
import CustomStackScreen from "../../../../src/components/CustomStackScreen";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const HistoryScreen = () => {
  // properties
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const { studentId, classId } = useAuthContext();
  const errorContext = useContext(ErrorContext);

  // states
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);
  // data
  const [statistics, setStatistics] =
    useState<AttendanceStatisticsModel | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceItemModel[]>(
    []
  );

  const attMutation = api.attendance.getAttendanceList.useMutation({
    onSuccess: (resp) => setAttendanceList(resp.attendances),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });
  const statMutation = api.attendance.getAttendanceStatistics.useMutation({
    onSuccess: (resp) => setStatistics(resp.statistics),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [studentId, timeStart, timeEnd, isFocused]);

  const refresh = () => {
    attMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? "",
      classId: classId ?? ""
    });
    statMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? "",
      classId: classId ?? ""
    });
  };

  const isLoading = () => attMutation.isLoading || statMutation.isLoading;

  return (
    <Body>
      <CustomStackScreen title={"Điểm danh"} />

      {/*<LoadingBar isFetching={isLoading()} />*/}
      <DateRangeFilterBar
        timeStart={timeStart}
        setTimeStart={setTimeStart}
        timeEnd={timeEnd}
        setTimeEnd={setTimeEnd}
      />

      <ScrollView
        className={"flex-col"}
        style={{}}
        refreshControl={
          <RefreshControl refreshing={isLoading()} onRefresh={refresh} />
        }
      >
        <CustomTitle title={"Tóm tắt điểm danh"} />
        {attendanceList?.length > 0 && (
          <View className={"mb-3"}>
            <CustomCard mode={"contained"}>
              <StatisticsChart
                series={[
                  statistics?.CheckedIn ?? 0,
                  statistics?.AbsenseWithPermission ?? 0,
                  statistics?.AbsenseWithoutPermission ?? 0
                ]}
              />
            </CustomCard>
          </View>
        )}

        <CustomTitle title={"Lịch sử điểm danh"} />
        <Body>
          <FlatList
            contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
            data={attendanceList}
            renderItem={({ item }: { item: AttendanceItemModel }) => (
              <AttendanceItem {...item} />
            )}
            scrollEnabled={false}
          />
        </Body>
      </ScrollView>
    </Body>
  );
};

export default HistoryScreen;
