import { useSearchParams } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Divider,
  Text,
  TextInput,
  useTheme,
  ProgressBar
} from "react-native-paper";
import { api } from "../../../src/utils/api";
import {
  PickupItemModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../../src/models/PickupModels";
import Body from "../../../src/components/Body";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import AlertModal from "../../../src/components/common/AlertModal";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";

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
  const theme = useTheme();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [pickup, setPickup] = useState<PickupItemModel | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const pickupMutation = api.pickup.getPickupDetail.useMutation({
    onSuccess: (resp) => setPickup(resp.pickup),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  // update list when search criterias change
  useEffect(() => {
    id != null &&
      pickupMutation.mutate({
        id: id
      });
  }, []);

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

      <ScrollView className={"bg-white p-5"}>
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

          <View className={"mb-2 flex-row justify-between"}>
            <Text>Giáo viên: </Text>
            <Text>{pickup?.teacherFullname ?? ""}</Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2"}>
            <Text className={"mb-2"}>Ghi chú: </Text>
            <TextInput
              disabled={true}
              style={{ fontSize: theme.fonts.bodyMedium.fontSize }}
            >
              {pickup?.note ?? "Không có ghi chú"}
            </TextInput>
          </View>
          <Divider className={"mb-2"} />
        </View>
      </ScrollView>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default PickupDetailScreen;
