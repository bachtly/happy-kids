import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import AttendanceItem from "../../../../src/components/attendance/AttendanceItem";
import { AttendanceItemModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { AttendanceContext } from "../../../../src/utils/attendance-context";
import Body from "../../../../src/components/Body";
import DateRangeFilterBar from "../../../../src/components/date-picker/DateRangeFilterBar";
import { useIsFocused } from "@react-navigation/native";
import LoadingBar from "../../../../src/components/common/LoadingBar";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const HistoryScreen = () => {
  // properties
  const { studentId } = React.useContext(AttendanceContext) ?? {
    studentId: null
  };
  const isFocused = useIsFocused();

  // states
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  // data
  const [attendanceList, setAttendanceList] = useState<AttendanceItemModel[]>(
    []
  );
  const attMutation = api.attendance.getAttendanceList.useMutation({
    onSuccess: (resp) => setAttendanceList(resp.attendances)
  });

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [studentId, timeStart, timeEnd, isFocused]);

  const refresh = () => {
    attMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  };

  const isLoading = () => attMutation.isLoading;

  return (
    <Body>
      <LoadingBar isFetching={isLoading()} />
      <DateRangeFilterBar
        timeStart={timeStart}
        setTimeStart={setTimeStart}
        timeEnd={timeEnd}
        setTimeEnd={setTimeEnd}
      />

      <FlatList
        onRefresh={() => refresh()}
        refreshing={isLoading()}
        contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
        data={attendanceList}
        renderItem={({ item }: { item: AttendanceItemModel }) => (
          <AttendanceItem {...item} />
        )}
      />
    </Body>
  );
};

export default HistoryScreen;
