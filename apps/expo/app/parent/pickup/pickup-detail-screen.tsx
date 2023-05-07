import { useSearchParams } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { api } from "../../../src/utils/api";
import { PickupItemModel } from "../../../src/models/PickupModels";
import Body from "../../../src/components/Body";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import LoadingBar from "../../../src/components/common/LoadingBar";
import EllipsedText from "../../../src/components/common/EllipsedText";
import { MedicineLetterStatus } from "../../../src/models/MedicineModels";
import LetterStatusText from "../../../src/components/medicine/StatusText";

const PickupDetailScreen = () => {
  const { id } = useSearchParams();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [pickup, setPickup] = useState<PickupItemModel | null>(null);

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
    refresh();
  }, []);

  const refresh = () => {
    id &&
      pickupMutation.mutate({
        id: id
      });
  };

  return (
    <Body>
      <CustomStackScreen title={"Chi tiết đón về"} />
      <LoadingBar isFetching={pickupMutation.isLoading} />

      <ScrollView
        className={"flex-1 bg-white"}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
      >
        <View className="flex-1 px-5 pb-5">
          <View className="flex-row justify-between py-3">
            <Text variant={"labelLarge"}>Trạng thái đơn</Text>
            <LetterStatusText status={pickup?.status as MedicineLetterStatus} />
          </View>

          <Divider />
          <View className={"space-y-1 py-3"}>
            <Text className={"mb-2"} variant={"labelLarge"}>
              Chi tiết đơn
            </Text>

            <View className="flex-row justify-between">
              <Text>Học sinh</Text>
              <Text className={"text-right"} variant={"bodyMedium"}>
                {pickup?.studentFullname}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text>Thời gian đón</Text>
              <Text className={"text-right"} variant={"bodyMedium"}>
                {moment(pickup?.time).format("DD/MM/YY")}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text>Người đón</Text>
              <Text className={"text-right"} variant={"bodyMedium"}>
                {pickup?.pickerFullname}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text>Giáo viên</Text>
              <Text className={"text-right"} variant={"bodyMedium"}>
                {pickup?.teacherFullname}
              </Text>
            </View>
          </View>

          <Divider />
          <View className={"space-y-1 py-3"}>
            <Text className="mb-3" variant={"labelLarge"}>
              Nội dung
            </Text>
            <EllipsedText
              lines={10}
              content={pickup?.note ?? "Không có nội dung"}
            />
          </View>
        </View>
      </ScrollView>
    </Body>
  );
};

export default PickupDetailScreen;
