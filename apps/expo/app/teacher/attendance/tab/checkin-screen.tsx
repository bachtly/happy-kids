import { useIsFocused } from "@react-navigation/native";
import moment, { Moment } from "moment/moment";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import CheckinItem from "../../../../src/components/attendance/CheckinItem";
import { AttendanceStudentModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { TeacherAttendanceContext } from "../../../../src/utils/attendance-context";
import Body from "../../../../src/components/Body";
import DateFilterBar from "../../../../src/components/date-picker/DateFilterBar";
import CustomStackScreen from "../../../../src/components/CustomStackScreen";
import { trpcErrorHandler } from "../../../../src/utils/trpc-error-handler";
import { useAuthContext } from "../../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../../src/utils/error-context";
import CustomTitle from "../../../../src/components/common/CustomTitle";
import { Text } from "react-native-paper";
import WhiteBody from "../../../../src/components/WhiteBody";

const DEFAULT_TIME = moment(moment.now());

const CheckinScreen = () => {
  // properties
  const isFocused = useIsFocused();
  const { classId } = useContext(TeacherAttendanceContext) ?? { classId: null };
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  // states
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  // data
  const [studentList, setStudentList] = useState<AttendanceStudentModel[]>([]);
  const attMutation = api.attendance.getStudentList.useMutation({
    onSuccess: (resp) => {
      setStudentList(resp.students);
    },
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
  }, [classId, time, isFocused]);

  const refresh = () => {
    classId &&
      attMutation.mutate({
        classId: classId,
        date: time.toDate()
      });
  };

  const isLoading = () => {
    return attMutation.isLoading;
  };

  const getNotCheckedIn = () => {
    return studentList.filter(
      (item) => item.attendanceStatus == "NotCheckedIn"
    );
  };

  const getCheckedIn = () => {
    return studentList.filter(
      (item) =>
        item.attendanceStatus == "CheckedIn" ||
        item.attendanceStatus == "CheckedOut"
    );
  };

  const getAbsence = () => {
    return studentList.filter(
      (item) =>
        item.attendanceStatus == "AbsenseWithPermission" ||
        item.attendanceStatus == "AbsenseWithoutPermission"
    );
  };

  return (
    <Body>
      <CustomStackScreen title={"Điểm danh"} />

      <DateFilterBar time={time} setTime={setTime} />

      <ScrollView
        className={"flex-1"}
        refreshControl={
          <RefreshControl refreshing={isLoading()} onRefresh={refresh} />
        }
      >
        <CustomTitle title={"Tóm tắt điểm danh"} />

        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <View className={"flex-1 px-3 pb-3"}>
              <View className={"flex-1 flex-row"}>
                <Text className={"flex-1"} variant={"titleSmall"}>
                  Sĩ số:
                </Text>
                <Text className={"flex-1"} variant={"titleSmall"}>
                  {studentList.length}
                </Text>
              </View>
              <View className={"flex-row"}>
                <Text
                  className={"flex-1"}
                  variant={"titleSmall"}
                  style={{ color: "#4FB477" }}
                >
                  Có mặt:
                </Text>
                <Text
                  className={"flex-1"}
                  variant={"titleSmall"}
                  style={{ color: "#4FB477" }}
                >
                  {getCheckedIn().length}/{studentList.length}
                </Text>
              </View>
              <View className={"flex-row"}>
                <Text
                  className={"flex-1"}
                  variant={"titleSmall"}
                  style={{ color: "#EE6352" }}
                >
                  Vắng mặt:
                </Text>
                <Text
                  className={"flex-1"}
                  variant={"titleSmall"}
                  style={{ color: "#EE6352" }}
                >
                  {getAbsence().length}/{studentList.length}
                </Text>
              </View>
              <View className={"flex-row"}>
                <Text
                  className={"flex-1"}
                  variant={"titleSmall"}
                  style={{ color: "#f1c40f" }}
                >
                  Chưa điểm danh:
                </Text>
                <Text
                  className={"flex-1"}
                  variant={"titleSmall"}
                  style={{ color: "#f1c40f" }}
                >
                  {getNotCheckedIn().length}/{studentList.length}
                </Text>
              </View>
            </View>
          </WhiteBody>
        </View>

        <CustomTitle title={"Chưa điểm danh"} />

        <FlatList
          contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          data={getNotCheckedIn()}
          renderItem={({ item }: { item: AttendanceStudentModel }) => (
            <CheckinItem attendance={item} refresh={refresh} date={time} />
          )}
          scrollEnabled={false}
        />

        <CustomTitle title={"Đã điểm danh"} />

        <FlatList
          contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          data={getCheckedIn().concat(getAbsence())}
          renderItem={({ item }: { item: AttendanceStudentModel }) => (
            <CheckinItem attendance={item} refresh={refresh} date={time} />
          )}
          scrollEnabled={false}
        />
      </ScrollView>
    </Body>
  );
};

export default CheckinScreen;
