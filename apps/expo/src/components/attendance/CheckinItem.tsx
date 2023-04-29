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

interface CheckinItemProps {
  attendanceStudentModel: AttendanceStudentModel;
  refresh: () => void;
}

const CheckinItem = (props: CheckinItemProps) => {
  const router = useRouter();

  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    setIsFilled(
      props.attendanceStudentModel.attendanceStatus != null &&
        props.attendanceStudentModel.attendanceStatus !=
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
            props.attendanceStudentModel.avatar
              ? {
                  uri: `data:image/jpeg;base64,${props.attendanceStudentModel.avatar}`
                }
              : defaultAvatar
          }
        />
        <View>
          <Text className={""} variant={"titleSmall"}>
            {props.attendanceStudentModel.fullname}
          </Text>
          <Text className={"italic"} variant={"bodyMedium"}>
            {props.attendanceStudentModel.attendanceStatus &&
              STATUS_ENUM_TO_VERBOSE.get(
                props.attendanceStudentModel.attendanceStatus
              )}
          </Text>
        </View>
      </View>

      <View className={"mb-2"}>
        <EllipsedText
          lines={2}
          content={
            isFilled
              ? props.attendanceStudentModel.attendanceCheckinNote ?? ""
              : "Hôm nay bé chưa được điểm danh"
          }
        />
      </View>

      {isFilled && (
        <MultipleImageView
          images={props.attendanceStudentModel.checkinPhotos ?? []}
        />
      )}

      {!isFilled && (
        <View style={{ alignSelf: "flex-end" }}>
          <UnderlineButton
            onPress={() => {
              router.push({
                pathname: "teacher/attendance/checkin-text-editor-screen",
                params: { studentId: props.attendanceStudentModel.id }
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
