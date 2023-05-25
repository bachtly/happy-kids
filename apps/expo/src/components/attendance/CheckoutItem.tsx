import React from "react";
import { View } from "react-native";
import { useTheme, IconButton } from "react-native-paper";
import {
  AttendanceStatus,
  AttendanceStudentModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/AttendanceModels";
import CustomCard from "../CustomCard";
import EllipsedText from "../common/EllipsedText";
import UnderlineButton from "../common/UnderlineButton";
import { useRouter } from "expo-router";
import { Moment } from "moment";
import MultipleImageView from "../common/MultiImageView";
import LetterStatusText from "../medicine/StatusText";
import UserWithAvatar from "../common/UserWithAvatar";

interface CheckoutItemProps {
  attendance: AttendanceStudentModel;
  refresh: () => void;
  time: Moment;
}

const CheckoutItem = (props: CheckoutItemProps) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <CustomCard>
      <View className={"mb-3 flex-row space-x-3"}>
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
                  pathname: "teacher/attendance/checkout-text-editor-screen",
                  params: {
                    id: props.attendance.id,
                    studentId: props.attendance.studentId,
                    time: props.time.toISOString()
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
            props.attendance.attendanceStatus == AttendanceStatus.CheckedOut
              ? props.attendance.attendanceCheckoutNote ?? "Không có ghi chú"
              : props.attendance.attendanceStatus == AttendanceStatus.CheckedIn
              ? "Bé chưa được điểm danh về"
              : props.attendance.attendanceStatus ==
                AttendanceStatus.NotCheckedIn
              ? "Bé chưa được điểm danh đến"
              : "Hôm nay bé vắng"
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
    </CustomCard>
  );
};

export default CheckoutItem;
