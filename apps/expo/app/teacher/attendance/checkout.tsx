import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import CheckOutItem from "../../../src/components/attendance/CheckOutItem";
import { StudentModel } from "../../../src/models/AttendanceModels";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";

const AttendanceCheckout = () => {
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
        <View className={"pt-3"}>
          {studentList && studentList.length > 0 ? (
            studentList.map((item, key) => <CheckOutItem key={key} {...item} />)
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

export default AttendanceCheckout;
