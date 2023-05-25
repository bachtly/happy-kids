import moment from "moment";
import { View } from "react-native";
import { Text, Divider } from "react-native-paper";
import { AttendanceItemModel } from "../../models/AttendanceModels";
import CustomCard from "../CustomCard";
import UserWithAvatar from "../common/UserWithAvatar";
import SingleImageView from "../common/SingleImageView";

const DATE_OF_WEEK = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy"
];
const DATE_FORMAT = "DD/MM/YYYY";
const TIME_FORMAT = "hh:mm";

const AttendanceItem = (props: AttendanceItemModel) => {
  return (
    <CustomCard mode={"contained"}>
      <Text className={"mb-3"} variant={"labelLarge"}>
        {`${DATE_OF_WEEK[props.date?.getDay() as number] ?? ""}, ${moment(
          props.date
        )
          .format(DATE_FORMAT)
          .toString()}`}
      </Text>
      <Divider className={"mb-3"} />

      <UserWithAvatar
        avatar={props.studentAvatar}
        name={props.studentFullname ?? ""}
        extraInfo={`Lớp: ${props.className ?? ""}`}
      />

      {props.status == "CheckedOut" || props.status == "CheckedIn" ? (
        <>
          <View className={"mb-3"}>
            {(props.checkinTeacherFullname || props.checkinNote) && (
              <>
                <Text variant={"labelLarge"}>Điểm danh đến</Text>
                {props.checkinTeacherFullname && (
                  <Text>Giáo viên: {props.checkinTeacherFullname}</Text>
                )}
                {props.checkinNote && <Text>Ghi chú: {props.checkinNote}</Text>}
              </>
            )}

            {(props.checkoutTeacherFullname || props.checkoutNote) && (
              <>
                <Text variant={"labelLarge"} className={"mt-1"}>
                  Điểm danh về
                </Text>
                {props.checkoutTeacherFullname && (
                  <Text>Giáo viên: {props.checkoutTeacherFullname}</Text>
                )}
                {props.checkoutNote && (
                  <Text>Ghi chú: {props.checkoutNote}</Text>
                )}
              </>
            )}
          </View>

          <View className={"flex-row space-x-2"}>
            <View className={"flex-1 flex-col"}>
              <View className={"aspect-square"}>
                <SingleImageView
                  image={props.checkinPhotos ? props.checkinPhotos[0] : ""}
                />
              </View>
              <Text className={"text-center"} variant={"labelLarge"}>
                {`Đến lúc: ${
                  (props.checkinTime &&
                    moment(props.checkinTime).format(TIME_FORMAT)) ??
                  ""
                }`}
              </Text>
            </View>
            <View className={"aspect-square w-full flex-1 flex-col"}>
              <View className={"aspect-square"}>
                <SingleImageView
                  image={props.checkoutPhotos ? props.checkoutPhotos[0] : ""}
                />
              </View>
              <Text className={"text-center"} variant={"labelLarge"}>
                {`Về lúc: ${
                  (props.checkoutTime &&
                    moment(props.checkoutTime).format(TIME_FORMAT)) ??
                  ""
                }`}
              </Text>
            </View>
          </View>
        </>
      ) : props.status == "AbsenseWithPermission" ? (
        <Text variant={"labelLarge"}>Bé vắng có phép</Text>
      ) : (
        <Text variant={"labelLarge"}>Bé vắng không phép</Text>
      )}
    </CustomCard>
  );
};

export default AttendanceItem;
