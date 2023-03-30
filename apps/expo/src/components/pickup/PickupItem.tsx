import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import {
  PickupItemModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/PickupModels";
import pickupIcon from "../../../assets/images/pickup-icon.png";
import moment from "moment/moment";

const DATE_FORMAT = "DD/MM/YYYY";
const TIME_FORMAT = "hh:mm";

const PickupItem = ({
  item,
  isTeacher
}: {
  item: PickupItemModel;
  isTeacher: boolean;
}) => {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View className={"mb-3"}>
      <Card
        mode={"elevated"}
        style={{ backgroundColor: colors.background, borderRadius: 2 }}
        onPress={() => {
          router.push({
            pathname: `${
              isTeacher ? "teacher" : "parent"
            }/pickup/pickup-detail-screen`,
            params: { id: item.id }
          });
        }}
      >
        <Card.Content className={"flex-row space-x-2"}>
          <Image className={"my-auto aspect-square w-16"} source={pickupIcon} />

          <View className={"flex-1 space-y-1"}>
            {isTeacher ? (
              <>
                <Text variant={"labelLarge"} className={""}>
                  {item.studentFullname}
                </Text>
                <Text className={""}>Người đón: {item.pickerFullname}</Text>
              </>
            ) : (
              <Text variant={"labelLarge"} className={""}>
                Người đón: {item.pickerFullname}
              </Text>
            )}
            <Text className={""}>
              Giờ đón: {moment(item.time).format(TIME_FORMAT).toString()}
            </Text>
            <Text>{moment(item.time).format(DATE_FORMAT).toString()}</Text>
            <Text className={"text-right italic"}>
              {item.status && STATUS_ENUM_TO_VERBOSE.get(item.status)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default PickupItem;
