import { useSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Divider,
  Text,
  TextInput,
  useTheme,
  Button,
  ProgressBar
} from "react-native-paper";
import { api } from "../../../src/utils/api";
import {
  PickupItemModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../../src/models/PickupModels";
import Body from "../../../src/components/Body";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import { useAuthContext } from "../../../src/utils/auth-context-provider";

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

const PickupDetailScreen = () => {
  const { id } = useSearchParams();
  const { userId } = useAuthContext();
  const theme = useTheme();

  // just to trigger
  const [changed, setChanged] = useState(false);

  const [pickup, setPickup] = useState<PickupItemModel | null>(null);

  const pickupMutation = api.pickup.getPickupDetail.useMutation({
    onSuccess: (resp) => setPickup(resp.pickup)
  });

  const confirmMutation = api.pickup.confirmPickupLetter.useMutation({
    onSuccess: () => setChanged(!changed)
  });

  const rejectMutation = api.pickup.rejectPickupLetter.useMutation({
    onSuccess: () => setChanged(!changed)
  });

  // update list when search criterias change
  useEffect(() => {
    id != null &&
      pickupMutation.mutate({
        id: id
      });
  }, [changed]);

  const getDateString = (date: Date, format: string) => {
    return `${DATE_OF_WEEK[date.getDay()] ?? ""}, ${moment(date)
      .format(format)
      .toString()}`;
  };

  const getTimeString = (time: Date | null | undefined, format: string) => {
    return time ? `${moment(time).format(format).toString()}` : "" ?? "";
  };

  return (
    <Body>
      <CustomStackScreen title={"Chi tiết đón về"} />
      {pickupMutation.isLoading && <ProgressBar indeterminate visible={true} />}

      <ScrollView className={"flex-1 bg-white p-5"}>
        <View className={"mb-5"}>
          {pickup && pickup.time && (
            <Text variant={"titleLarge"}>
              {getDateString(pickup.time, DATE_FORMAT)}
            </Text>
          )}
        </View>

        <View className={"mb-5"}>
          <View className={"mb-2 flex-row justify-between"}>
            <Text>Tình trạng đơn: </Text>
            <Text>
              {pickup?.status && STATUS_ENUM_TO_VERBOSE.get(pickup.status)}
            </Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2 flex-row justify-between"}>
            <Text>Người đón: </Text>
            <Text>{pickup?.pickerFullname ?? ""}</Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2 flex-row justify-between"}>
            <Text>Thời gian đón: </Text>
            <Text>{getTimeString(pickup?.time, TIME_FORMAT)}</Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={""}>
            <Text className={"mb-2"}>Ghi chú của phụ huynh: </Text>
            <TextInput
              disabled={true}
              style={{ fontSize: theme.fonts.bodyMedium.fontSize }}
            >
              {pickup?.note ?? "Không có ghi chú"}
            </TextInput>
          </View>
        </View>

        <View className={"flex-row space-x-2"}>
          <Button
            className={"flex-1"}
            mode={"contained"}
            onPress={() =>
              confirmMutation.mutate({
                id: id,
                teacherId: userId ?? ""
              })
            }
            disabled={pickup?.status != "NotConfirmed"}
          >
            Xác nhận
          </Button>
          <Button
            className={"flex-1"}
            mode={"contained-tonal"}
            onPress={() =>
              rejectMutation.mutate({
                id: id,
                teacherId: userId ?? ""
              })
            }
            disabled={pickup?.status != "NotConfirmed"}
          >
            Từ chối
          </Button>
        </View>
      </ScrollView>
    </Body>
  );
};

export default PickupDetailScreen;
