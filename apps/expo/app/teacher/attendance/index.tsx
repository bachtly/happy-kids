import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import CheckinItem from "../../../src/components/attendance/CheckinItem";
import { StudentModel } from "../../../src/models/AttendanceModels";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";

const AttendanceCheckin = () => {
  // properties
  const { colors } = useTheme();
  const { classId } = useAuthContext();

  const [filter, setFilter] = useState({
    searchStr: "",
    status: ""
  });

  // data
  const [studentList, setStudentList] = useState<StudentModel[]>([]);
  const attMutation = api.attendance.getStudentList.useMutation({
    onSuccess: (resp) => setStudentList(resp.students)
  });

  // update list when search criterias change
  useEffect(() => {
    classId &&
      attMutation.mutate({
        classId: classId
      });
  }, [classId]);

  return (
    <View className={"flex-1 bg-white px-2"}>
      <ScrollView>
        <View className={"flex mt-4 mb-1"}>
          <Text variant={"titleLarge"}>
            Lớp: {studentList.length > 0 && studentList[0].className}
          </Text>
        </View>

        <View className={"pt-3"}>
          {studentList && studentList.length > 0 ? (
            studentList.map((item, key) => <CheckinItem key={key} {...item} />)
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
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceCheckin;
