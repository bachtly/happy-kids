import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme, ProgressBar } from "react-native-paper";
import AttendanceItem from "../../../../src/components/attendance/AttendanceItem";
import { AttendanceItemModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { AttendanceContext } from "../../../../src/utils/attendance-context";
import Body from "../../../../src/components/Body";
import DateRangeFilterBar from "../../../../src/components/date-picker/DateRangeFilterBar";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const HistoryScreen = () => {
  // properties
  const { colors } = useTheme();
  const { studentId } = React.useContext(AttendanceContext) ?? {
    studentId: null
  };

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
    attMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  }, [studentId, timeStart, timeEnd]);

  return (
    <Body>
      {attMutation.isLoading && <ProgressBar indeterminate visible={true} />}
      <DateRangeFilterBar
        timeStart={timeStart}
        setTimeStart={setTimeStart}
        timeEnd={timeEnd}
        setTimeEnd={setTimeEnd}
      />

      <ScrollView className={"p-2"}>
        {attendanceList != null && attendanceList.length > 0 ? (
          attendanceList.map((item, key) => (
            <AttendanceItem key={key} {...item} />
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
  );
};

export default HistoryScreen;
