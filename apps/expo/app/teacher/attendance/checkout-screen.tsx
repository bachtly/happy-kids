import { useFocusEffect } from "expo-router";
import moment, { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import CheckoutItem from "../../../src/components/attendance/CheckoutItem";
import DatePicker from "../../../src/components/DatePicker";
import { AttendanceStudentModel } from "../../../src/models/AttendanceModels";
import { api } from "../../../src/utils/api";
import { TeacherAttendanceContext } from "../../../src/utils/parent-attendance-context";

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
    <View className={"flex-1 bg-white px-2"}>
      <View className={"fixed my-4 flex-row justify-between"}>
        <View className={""}>
          <DatePicker initTime={time} setTime={setTime} />
        </View>

        <View className={"flex-row justify-between space-x-4"}>
          <Pressable className={""}>
            <View className={"m-auto"}>
              <AntDesign name={"filter"} size={25}></AntDesign>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView>
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
    </View>
  );
};

export default CheckoutScreen;
