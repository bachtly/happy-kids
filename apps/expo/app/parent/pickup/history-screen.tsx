import React, { useContext, useEffect, useState } from "react";
import { ProgressBar } from "react-native-paper";
import { useSearchParams, useRouter } from "expo-router";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { FlatList } from "react-native";
import PickupItem from "../../../src/components/pickup/PickupItem";
import { PickupItemModel } from "../../../src/models/PickupModels";
import { useIsFocused } from "@react-navigation/native";
import DateRangeFilterBar from "../../../src/components/date-picker/DateRangeFilterBar";
import Body from "../../../src/components/Body";
import CustomStack from "../../../src/components/CustomStackScreen";
import AlertModal from "../../../src/components/common/AlertModal";
import ItemListWrapper from "../../../src/components/common/ItemListWrapper";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const HistoryScreen = () => {
  const router = useRouter();
  const { studentId } = useSearchParams();
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  // states
  const [studentIdSaved, setStudentIdSaved] = useState("");
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);
  const [errorMessage, setErrorMessage] = useState("");

  // data
  const [pickupList, setPickupList] = useState<PickupItemModel[]>([]);

  const pickupMutation = api.pickup.getPickupList.useMutation({
    onSuccess: (resp) => setPickupList(resp.pickups),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const refresh = () => {
    pickupMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  };

  // prevent the lost of studentId in searchParams when routing between tabs
  useEffect(() => {
    studentId && setStudentIdSaved(studentId);
  }, [studentId]);

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [studentId, timeStart, timeEnd, isFocused]);

  return (
    <>
      <Body>
        <CustomStack
          title={"Đón về"}
          addButtonHandler={() => {
            router.push({
              pathname: "parent/pickup/add-pickup-screen",
              params: { studentId: studentIdSaved }
            });
          }}
        />

        {pickupMutation.isLoading && (
          <ProgressBar indeterminate visible={true} />
        )}

        <DateRangeFilterBar
          timeStart={timeStart}
          setTimeStart={setTimeStart}
          timeEnd={timeEnd}
          setTimeEnd={setTimeEnd}
        />

        <ItemListWrapper
          fetchData={() => refresh()}
          isFetching={pickupMutation.isLoading}
          isEmpty={pickupList.length == 0}
          emptyPlaceHolderText={"Danh sách đơn trống"}
        >
          <FlatList
            onRefresh={() => refresh()}
            refreshing={pickupMutation.isLoading}
            contentContainerStyle={{
              gap: 8,
              paddingBottom: 8,
              paddingTop: 8
            }}
            data={pickupList}
            renderItem={({ item }: { item: PickupItemModel }) => (
              <PickupItem item={item} isTeacher={false} />
            )}
          />
        </ItemListWrapper>

        <AlertModal
          visible={errorMessage != ""}
          title={"Thông báo"}
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      </Body>
    </>
  );
};

export default HistoryScreen;
