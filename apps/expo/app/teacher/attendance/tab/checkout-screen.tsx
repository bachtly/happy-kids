import moment, { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import CheckoutItem from "../../../../src/components/attendance/CheckoutItem";
import { AttendanceStudentModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { TeacherAttendanceContext } from "../../../../src/utils/attendance-context";
import Body from "../../../../src/components/Body";
import DateFilterBar from "../../../../src/components/date-picker/DateFilterBar";
import { useIsFocused } from "@react-navigation/native";
import { useAuthContext } from "../../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../../src/utils/trpc-error-handler";
import CustomTitle from "../../../../src/components/common/CustomTitle";
import WhiteBody from "../../../../src/components/WhiteBody";
import { Text } from "react-native-paper";

const DEFAULT_TIME = moment(moment.now());

const CheckoutScreen = () => {
  // properties
  const { classId } = useContext(TeacherAttendanceContext) ?? { classId: null };
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  // data
  const [studentList, setStudentList] = useState<AttendanceStudentModel[]>([]);
  const attMutation = api.attendance.getStudentList.useMutation({
    onSuccess: (resp) => setStudentList(resp.students),
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

  const getNotCheckedOut = () => {
    return studentList.filter(
      (item) =>
        item.attendanceStatus == "NotCheckedIn" ||
        item.attendanceStatus == "CheckedIn"
    );
  };

  const getCheckedOut = () => {
    return studentList.filter((item) => item.attendanceStatus == "CheckedOut");
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
      <DateFilterBar time={time} setTime={setTime} />

      <ScrollView
        className={"flex-1"}
        refreshControl={
          <RefreshControl refreshing={isLoading()} onRefresh={refresh} />
        }
      >
        <CustomTitle title={"Tóm tắt điểm danh"} />

        <View className={"flex-1 pb-3"}>
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
                  Đã điểm danh về:
                </Text>
                <Text
                  className={"flex-1"}
                  variant={"titleSmall"}
                  style={{ color: "#4FB477" }}
                >
                  {getCheckedOut().length}/{studentList.length}
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
                  {getNotCheckedOut().length}/{studentList.length}
                </Text>
              </View>
            </View>
          </WhiteBody>
        </View>

        <CustomTitle title={"Chưa điểm danh"} />

        <FlatList
          contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          data={getNotCheckedOut()}
          renderItem={({ item }: { item: AttendanceStudentModel }) => (
            <CheckoutItem
              attendance={item}
              refresh={() => refresh()}
              time={time}
            />
          )}
          scrollEnabled={false}
        />

        <CustomTitle title={"Đã điểm danh"} />

        <FlatList
          contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          data={getCheckedOut().concat(getAbsence())}
          renderItem={({ item }: { item: AttendanceStudentModel }) => (
            <CheckoutItem attendance={item} refresh={refresh} time={time} />
          )}
          scrollEnabled={false}
        />
      </ScrollView>
    </Body>
  );
};

export default CheckoutScreen;
