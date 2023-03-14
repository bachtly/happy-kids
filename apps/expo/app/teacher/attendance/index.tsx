import React, {useEffect, useState} from "react";
import {Pressable, ScrollView, View} from "react-native";
import {Text, useTheme} from "react-native-paper";
import CheckinItem from "../../../src/components/attendance/CheckinItem";
import {AttendanceStudentModel} from "../../../src/models/AttendanceModels";
import {api} from "../../../src/utils/api";
import {useAuthContext} from "../../../src/utils/auth-context-provider";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment, {Moment} from "moment/moment";
import DatePicker from "../../../src/components/DatePicker";

const DEFAULT_TIME = moment(moment.now()).subtract(7, "days");

const AttendanceCheckin = () => {
  // properties
  const {colors} = useTheme();
  const {classId} = useAuthContext();

  // states
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);
  const [filter, setFilter] = useState({
    searchStr: "",
    status: ""
  });

  // data
  const [studentList, setStudentList] = useState<AttendanceStudentModel[]>([]);
  const attMutation = api.attendance.getStudentList.useMutation({
    onSuccess: (resp) => {
      setStudentList(resp.students)
    }
  });

  // update list when search criterias change
  useEffect(() => {
    classId &&
    attMutation.mutate({
      classId: classId
    });
  }, [classId, time]);

  const refresh = () => {
    classId &&
    attMutation.mutate({
      classId: classId
    });
  }

  return (
    <View className={"flex-1 bg-white px-2"}>
      <View className={"fixed my-4 flex-row justify-between"}>
        <View className={""}>
          <DatePicker
            initTime={time}
            setTime={setTime}
          />
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
        <View className={"flex mb-1"}>
          <Text variant={"titleLarge"}>
            Lớp: {studentList[0]?.className ?? ""}
          </Text>
        </View>

        <View className={"pt-3"}>
          {studentList && studentList.length > 0 ? (
            studentList.map((item, key) =>
              <CheckinItem key={key} attendanceStudentModel={item} refresh={refresh}/>
            )
          ) : (
            <View className={"mt-5 mb-10"}>
              <Text
                className={"text-center"}
                variant={"titleLarge"}
                style={{color: colors.gray}}
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