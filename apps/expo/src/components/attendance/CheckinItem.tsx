import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import {
  AttendanceStatus,
  AttendanceStudentModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/AttendanceModels";
import CustomCard from "../CustomCard";
import { useRouter } from "expo-router";
import UnderlineButton from "../common/UnderlineButton";
import EllipsedText from "../common/EllipsedText";
import MultipleImageView from "../common/MultiImageView";
import LetterStatusText from "../medicine/StatusText";
import UserWithAvatar from "../common/UserWithAvatar";
import { Moment } from "moment";

interface CheckinItemProps {
  attendance: AttendanceStudentModel;
  refresh: () => void;
  date: Moment;
}

const CheckinItem = (props: CheckinItemProps) => {
  const router = useRouter();
  const theme = useTheme();

  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    setIsFilled(
      props.attendance.attendanceStatus != null &&
        props.attendance.attendanceStatus !=
          AttendanceStatus.NotCheckedIn.toString()
    );
  });

  return (
    <CustomCard>
      <View className={"flex-row"}>
        <UserWithAvatar
          avatar={props.attendance.avatar}
          name={props.attendance.fullname ?? ""}
          extraInfo={
            STATUS_ENUM_TO_VERBOSE.get(
              props.attendance.attendanceStatus ?? ""
            ) ?? ""
          }
          rightButton={
            <IconButton
              icon={"pencil"}
              iconColor={theme.colors.primary}
              size={16}
              mode={"outlined"}
              onPress={() => {
                router.push({
                  pathname: "teacher/attendance/checkin-text-editor-screen",
                  params: {
                    studentId: props.attendance.studentId,
                    id: props.attendance.id,
                    dateStr: props.date.toISOString()
                  }
                });
              }}
            />
          }
        />
      </View>

      <View className={"mb-2"}>
        <EllipsedText
          lines={2}
          content={
            isFilled
              ? props.attendance.attendanceCheckinNote &&
                props.attendance.attendanceCheckinNote != ""
                ? props.attendance.attendanceCheckinNote
                : "Không có ghi chú"
              : "Bé chưa được điểm danh"
          }
        />
      </View>

      {isFilled && props.attendance.checkinPhotos && (
        <View className={"mb-2"}>
          <MultipleImageView images={props.attendance.checkinPhotos} />
        </View>
      )}

      {props.attendance?.leaveletters &&
        props.attendance.leaveletters.map((leaveletter, key) => (
          <View key={key}>
            <UnderlineButton
              icon={"file"}
              onPress={() => {
                router.push({
                  pathname: "teacher/leaveletter/letter-detail-screen",
                  params: {
                    id: leaveletter.id,
                    studentName: props.attendance.fullname
                  }
                });
              }}
            >
              Bé có đơn xin nghỉ (
              {leaveletter.status && (
                <LetterStatusText status={leaveletter.status} />
              )}
              )
            </UnderlineButton>
          </View>
        ))}
    </CustomCard>
  );
};

export default CheckinItem;
