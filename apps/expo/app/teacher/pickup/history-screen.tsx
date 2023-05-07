import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "expo-router";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { FlatList, View } from "react-native";
import PickupItem from "../../../src/components/pickup/PickupItem";
import { PickupItemModel } from "../../../src/models/PickupModels";
import { useIsFocused } from "@react-navigation/native";
import Body from "../../../src/components/Body";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import ItemListWrapper from "../../../src/components/common/ItemListWrapper";
import AlertModal from "../../../src/components/common/AlertModal";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import LoadingBar from "../../../src/components/common/LoadingBar";
import DateRangeFilterBar from "../../../src/components/date-picker/DateRangeFilterBar";

const DEFAULT_TIME_START = moment().startOf("day");
const DEFAULT_TIME_END = moment().startOf("day").add(7, "d");

const HistoryScreen = () => {
  const { classId } = useSearchParams();
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  // states
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  // data
  const [classIdSaved, setClassIdSaved] = useState("");
  const [pickupList, setPickupList] = useState<PickupItemModel[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const pickupMutation = api.pickup.getPickupListFromClassId.useMutation({
    onSuccess: (resp) => setPickupList(resp.pickups),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    classId && setClassIdSaved(classId);
  }, [classId]);

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [classIdSaved, timeStart, timeEnd, isFocused]);

  const refresh = () => {
    pickupMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      classId: classIdSaved ?? ""
    });
  };

  return (
    <Body>
      <CustomStackScreen title={"Đón về"} />
      <LoadingBar isFetching={pickupMutation.isLoading} />

      <DateRangeFilterBar
        timeStart={timeStart}
        timeEnd={timeEnd}
        setTimeStart={setTimeStart}
        setTimeEnd={setTimeEnd}
      />

      <ItemListWrapper
        fetchData={() => refresh()}
        isFetching={pickupMutation.isLoading}
        isEmpty={pickupList.length == 0}
        emptyPlaceHolderText={"Danh sách đơn trống"}
      >
        <View>
          <FlatList
            onRefresh={() => refresh()}
            refreshing={pickupMutation.isLoading}
            contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
            data={pickupList}
            renderItem={({ item }: { item: PickupItemModel }) => (
              <PickupItem item={item} isTeacher={true} />
            )}
          />
        </View>
      </ItemListWrapper>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default HistoryScreen;
