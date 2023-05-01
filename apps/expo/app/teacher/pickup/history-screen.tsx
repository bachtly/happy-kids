import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-native-paper";
import { useSearchParams } from "expo-router";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { FlatList, View } from "react-native";
import PickupItem from "../../../src/components/pickup/PickupItem";
import { PickupItemModel } from "../../../src/models/PickupModels";
import { useIsFocused } from "@react-navigation/native";
import Body from "../../../src/components/Body";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import ItemListWrapper from "../../../src/components/common/ItemListWrapper";
import AlertModal from "../../../src/components/common/AlertModal";

const DEFAULT_TIME = moment(moment.now());

const HistoryScreen = () => {
  const { classId } = useSearchParams();
  const isFocused = useIsFocused();

  // states
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  // data
  const [classIdSaved, setClassIdSaved] = useState("");
  const [pickupList, setPickupList] = useState<PickupItemModel[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const pickupMutation = api.pickup.getPickupListFromClassId.useMutation({
    onSuccess: (resp) => setPickupList(resp.pickups),
    onError: (e) => setErrorMessage(e.message)
  });

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    classId && setClassIdSaved(classId);
  }, [classId]);

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [classIdSaved, time, isFocused]);

  const refresh = () => {
    pickupMutation.mutate({
      time: time.toDate(),
      classId: classIdSaved ?? ""
    });
  };

  return (
    <Body>
      <CustomStackScreen title={"Đón về"} />
      {pickupMutation.isLoading && <ProgressBar indeterminate visible={true} />}

      <DateFilterBar time={time} setTime={setTime} />

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
