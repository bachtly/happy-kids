import { useIsFocused } from "@react-navigation/native";
import moment, { Moment } from "moment/moment";
import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ProgressBar } from "react-native-paper";
import CheckinItem from "../../../../src/components/attendance/CheckinItem";
import { AttendanceStudentModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { TeacherAttendanceContext } from "../../../../src/utils/attendance-context";
import Body from "../../../../src/components/Body";
import DateFilterBar from "../../../../src/components/date-picker/DateFilterBar";
import CustomStackScreen from "../../../../src/components/CustomStackScreen";
import AlertModal from "../../../../src/components/common/AlertModal";

const DEFAULT_TIME = moment(moment.now());

const CheckinScreen = () => {
  // properties
  const isFocused = useIsFocused();
  const { classId } = useContext(TeacherAttendanceContext) ?? { classId: null };

  // states
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);
  const [errorMessage, setErrorMessage] = useState("");

  // data
  const [studentList, setStudentList] = useState<AttendanceStudentModel[]>([]);
  const attMutation = api.attendance.getStudentList.useMutation({
    onSuccess: (resp) => {
      setStudentList(resp.students);
    },
    onError: (e) => setErrorMessage(e.message)
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

  return (
    <Body>
      <CustomStackScreen title={"Điểm danh"} />

      {isLoading() && <ProgressBar indeterminate visible={true} />}

      <DateFilterBar time={time} setTime={setTime} />

      <FlatList
        onRefresh={() => refresh()}
        refreshing={isLoading()}
        contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
        data={studentList}
        renderItem={({ item }: { item: AttendanceStudentModel }) => (
          <CheckinItem attendance={item} refresh={refresh} />
        )}
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default CheckinScreen;
