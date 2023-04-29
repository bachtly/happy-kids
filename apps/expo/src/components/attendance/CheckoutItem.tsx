import React from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import {
  AttendanceStatus,
  AttendanceStudentModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/AttendanceModels";
import CustomCard from "../CustomCard";
import defaultAvatar from "assets/images/default-user-avatar.png";
import EllipsedText from "../common/EllipsedText";
import UnderlineButton from "../common/UnderlineButton";
import { useRouter } from "expo-router";
import { Moment } from "moment";
import MultipleImageView from "../common/MultiImageView";

interface CheckoutItemProps {
  attendanceStudentModel: AttendanceStudentModel;
  refresh: () => void;
  time: Moment;
}

const CheckoutItem = (props: CheckoutItemProps) => {
  const router = useRouter();

  return (
    <CustomCard>
      <View className={"mb-3 flex-row space-x-3"}>
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
            props.attendanceStudentModel.attendanceStatus ==
            AttendanceStatus.CheckedOut
              ? props.attendanceStudentModel.attendanceCheckoutNote ?? ""
              : props.attendanceStudentModel.attendanceStatus ==
                AttendanceStatus.CheckedIn
              ? "Hôm nay bé chưa được điểm danh về"
              : "Hôm nay bé chưa được điểm danh đến"
          }
        />
      </View>

      {props.attendanceStudentModel.attendanceStatus ==
        AttendanceStatus.CheckedOut && (
        <MultipleImageView
          images={props.attendanceStudentModel.checkinPhotos ?? []}
        />
      )}

      {props.attendanceStudentModel.attendanceStatus ==
        AttendanceStatus.CheckedIn && (
        <View style={{ alignSelf: "flex-end" }}>
          <UnderlineButton
            onPress={() => {
              router.push({
                pathname: "teacher/attendance/checkout-text-editor-screen",
                params: {
                  studentId: props.attendanceStudentModel.id,
                  time: props.time.toISOString()
                }
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

export default CheckoutItem;
