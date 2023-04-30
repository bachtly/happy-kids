import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import {
  AttendanceStatus,
  AttendanceStudentModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/AttendanceModels";
import CustomCard from "../CustomCard";
import { useRouter } from "expo-router";
import UnderlineButton from "../common/UnderlineButton";
import EllipsedText from "../common/EllipsedText";
import defaultAvatar from "assets/images/default-user-avatar.png";
import MultipleImageView from "../common/MultiImageView";
import LetterStatusText from "../medicine/StatusText";

interface CheckinItemProps {
  attendance: AttendanceStudentModel;
  refresh: () => void;
}

const CheckinItem = (props: CheckinItemProps) => {
  const router = useRouter();

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
      <View className={"mb-3 flex-row space-x-2"}>
        <Avatar.Image
          className={"my-auto"}
          size={42}
          source={
            props.attendance.avatar
              ? {
                  uri: `data:image/jpeg;base64,${props.attendance.avatar}`
                }
              : defaultAvatar
          }
        />
        <View>
          <Text className={""} variant={"titleSmall"}>
            {props.attendance.fullname}
          </Text>
          <Text className={"italic"} variant={"bodyMedium"}>
            {props.attendance.attendanceStatus &&
              STATUS_ENUM_TO_VERBOSE.get(props.attendance.attendanceStatus)}
          </Text>
        </View>
      </View>

      <View className={"mb-2"}>
        <EllipsedText
          lines={2}
          content={
            isFilled
              ? props.attendance.attendanceCheckinNote ?? ""
              : "Bé chưa được điểm danh"
          }
        />
      </View>

      {isFilled && (
        <MultipleImageView images={props.attendance.checkinPhotos ?? []} />
      )}

      {props.attendance.leaveletterStatus && (
        <UnderlineButton
          icon={"file"}
          onPress={() => {
            router.push({
              pathname: "teacher/leaveletter/letter-detail-screen",
              params: {
                id: props.attendance.leaveletterId,
                studentName: props.attendance.fullname
              }
            });
          }}
        >
          Bé có đơn xin nghỉ (
          {<LetterStatusText status={props.attendance.leaveletterStatus} />})
        </UnderlineButton>
      )}

      {!isFilled &&
        (!props.attendance.leaveletterStatus ||
          props.attendance.leaveletterStatus != "NotConfirmed") && (
          <View style={{ alignSelf: "flex-end" }}>
            <UnderlineButton
              onPress={() => {
                router.push({
                  pathname: "teacher/attendance/checkin-text-editor-screen",
                  params: { studentId: props.attendance.id }
                });
              }}
            >
              Điểm danh ngay
            </UnderlineButton>
          </View>
        )}
    </CustomCard>
  );
};

export default CheckinItem;
