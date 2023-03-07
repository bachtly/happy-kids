import { View } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import moment from "moment";
import { useRouter } from "expo-router";

interface AttendanceItemProps {
  status: string | null;
  checkinTime: Date | null;
  checkoutTime: Date | null;
  checkinNote: string | null;
  checkoutNote: string | null;
  date: Date | null;
}

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

const STATUS_ENUM_TO_VERBOSE = new Map([
  ["NotCheckedIn", "Chưa điểm danh"],
  ["CheckedIn", "Đã điểm danh"],
  ["AbsenseWithPermission", "Vắng có phép"],
  ["AbsenseWithoutPermission", "Vắng không phép"]
]);

const AttendanceItem = (props: AttendanceItemProps) => {
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
              Điểm danh đến: {moment(props.checkinTime).format(DATE_FORMAT)}
            </Text>
            <Text>Điểm danh đến:</Text>
          </View>
          {props.status && STATUS_ENUM_TO_VERBOSE.has(props.status) && (
            <View className={"flex-row justify-between"}>
              <Text className={"my-auto italic"}>
                {STATUS_ENUM_TO_VERBOSE.get(props.status)}
              </Text>
              <Button
                className={"my-auto"}
                onPress={() => {
                  router.push("/attendance/detail");
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
export type { AttendanceItemProps };
