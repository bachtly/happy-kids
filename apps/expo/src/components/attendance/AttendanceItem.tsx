import { useRouter } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import {
  AttendanceItemModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/AttendanceModels";
import CustomCard from "../CustomCard";

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
  const router = useRouter();

  return (
    <CustomCard>
      <View className={"mb-2"}>
        <Text variant={"titleSmall"}>{`${
          DATE_OF_WEEK[props.date?.getDay() as number] ?? ""
        }, ${moment(props.date).format(DATE_FORMAT).toString()}`}</Text>
      </View>
      <View className={""}>
        <Text>
          Điểm danh đến:{" "}
          {(props.checkinTime &&
            moment(props.checkinTime).format(TIME_FORMAT)) ||
            ""}
        </Text>
        <Text>
          Điểm danh về:{" "}
          {(props.checkoutTime &&
            moment(props.checkoutTime).format(TIME_FORMAT)) ||
            ""}
        </Text>
      </View>
      {props.status && STATUS_ENUM_TO_VERBOSE.has(props.status) && (
        <View className={"flex-row justify-between"}>
          <Text className={"my-auto italic"}>
            {STATUS_ENUM_TO_VERBOSE.get(props.status)}
          </Text>
          <Button
            className={"my-auto"}
            onPress={() => {
              if (props.date) {
                router.push({
                  pathname: `/parent/attendance/detail-screen`,
                  params: { date: props.date.toString(), id: props.id }
                });
              }
            }}
          >
            Chi tiết
          </Button>
        </View>
      )}
    </CustomCard>
  );
};

export default AttendanceItem;
