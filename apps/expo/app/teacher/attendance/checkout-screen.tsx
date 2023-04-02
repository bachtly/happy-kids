import { useFocusEffect } from "expo-router";
import moment, { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme, ProgressBar } from "react-native-paper";
import CheckoutItem from "../../../src/components/attendance/CheckoutItem";
import { AttendanceStudentModel } from "../../../src/models/AttendanceModels";
import { api } from "../../../src/utils/api";
import { TeacherAttendanceContext } from "../../../src/utils/attendance-context";
import Body from "../../../src/components/Body";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";

const DEFAULT_TIME = moment(moment.now());

const CheckoutScreen = () => {
  // properties
  const { colors } = useTheme();
  const { classId } = useContext(TeacherAttendanceContext) ?? { classId: null };

  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  // data
  const [studentList, setStudentList] = useState<AttendanceStudentModel[]>([]);
  const attMutation = api.attendance.getStudentList.useMutation({
    onSuccess: (resp) => setStudentList(resp.students)
  });

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [classId, time]);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [])
  );

  const refresh = () => {
    classId &&
      attMutation.mutate({
        classId: classId,
        date: time.toDate()
      });
  };

  return (
    <Body>
      {attMutation.isLoading && <ProgressBar indeterminate visible={true} />}

      <DateFilterBar time={time} setTime={setTime} />

      <ScrollView className={"p-2"}>
        <View className={"mb-1 flex"}>
          <Text variant={"titleLarge"}>
            Lớp: {studentList[0]?.className ?? ""}
          </Text>
        </View>

        <View className={"pt-3"}>
          {studentList && studentList.length > 0 ? (
            studentList.map((item, key) => (
              <CheckoutItem
                key={key}
                attendanceStudentModel={item}
                refresh={() => refresh()}
                date={time.toDate()}
              />
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
        </View>
      </ScrollView>
    </Body>
  );
};

export default CheckoutScreen;
