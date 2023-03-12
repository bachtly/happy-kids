import { useRouter } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { AttendanceItemModel } from "../../models/AttendanceModels";

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

const STATUS_ENUM_TO_VERBOSE = new Map([
  ["NotCheckedIn", "Chưa điểm danh"],
  ["CheckedIn", "Đã điểm danh"],
  ["AbsenseWithPermission", "Vắng có phép"],
  ["AbsenseWithoutPermission", "Vắng không phép"]
]);

const AttendanceItem = (props: AttendanceItemModel) => {
  const router = useRouter();

  return (
    <View className={"mb-3"}>
      <Card>
        <Card.Content>
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
                    router.setParams({ date: props.date.toString() });
                    router.push(`/parent/attendance/${props.id}`);
                  }
                }}
              >
                Chi tiết
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

export default AttendanceItem;
