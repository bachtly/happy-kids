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
import LetterStatusText from "../medicine/StatusText";

interface CheckoutItemProps {
  attendance: AttendanceStudentModel;
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
          <Text className={""} variant={"labelMedium"}>
            {props.attendance.attendanceStatus &&
              STATUS_ENUM_TO_VERBOSE.get(props.attendance.attendanceStatus)}
          </Text>
        </View>
      </View>

      <View className={"mb-2"}>
        <EllipsedText
          lines={2}
          content={
            props.attendance.attendanceStatus == AttendanceStatus.CheckedOut
              ? props.attendance.attendanceCheckoutNote ?? ""
              : props.attendance.attendanceStatus == AttendanceStatus.CheckedIn
              ? "Bé chưa được điểm danh về"
              : "Bé chưa được điểm danh đến"
          }
        />
      </View>

      {props.attendance.attendanceStatus == AttendanceStatus.CheckedOut && (
        <MultipleImageView images={props.attendance.checkoutPhotos ?? []} />
      )}

      {props.attendance.pickupLetterStatus && (
        <UnderlineButton
          icon={"file"}
          onPress={() => {
            router.push({
              pathname: "teacher/pickup/pickup-detail-screen",
              params: { id: props.attendance.pickupLetterId }
            });
          }}
        >
          Bé có đơn đón về (
          {<LetterStatusText status={props.attendance.pickupLetterStatus} />})
        </UnderlineButton>
      )}

      {props.attendance.attendanceStatus == AttendanceStatus.CheckedIn && (
        <View style={{ alignSelf: "flex-end" }}>
          <UnderlineButton
            onPress={() => {
              router.push({
                pathname: "teacher/attendance/checkout-text-editor-screen",
                params: {
                  studentId: props.attendance.id,
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
