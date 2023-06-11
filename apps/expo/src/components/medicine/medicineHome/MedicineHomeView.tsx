import { useNavigation, useRouter } from "expo-router";
import moment, { Moment } from "moment";

import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { api } from "../../../utils/api";

import { MedicineLetterList } from "./MedicineLetterList";
import CustomStackScreen from "../../CustomStackScreen";
import DateRangeFilterBar from "../../date-picker/DateRangeFilterBar";
import ItemListWrapper from "../../common/ItemListWrapper";
import { MedLetterItem } from "../../../models/MedicineModels";
import AlertModal from "../../common/AlertModal";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import { useAuthContext } from "../../../utils/auth-context-provider";
import { ErrorContext } from "../../../utils/error-context";
import LoadingBar from "../../common/LoadingBar";

const CheckOverlapDate = (
  xFrom: Moment,
  xTo: Moment,
  yFrom: Moment,
  yTo: Moment
) => {
  const mxFrom = moment.max(xFrom.startOf("day"), yFrom.startOf("day"));
  const mnTo = moment.min(xTo.startOf("day"), yTo.startOf("day"));
  return mxFrom.isSameOrBefore(mnTo);
};

const MedicineHomeView = ({
  isTeacher,
  classId,
  studentId
}: {
  isTeacher: boolean;
  classId: string;
  studentId: string;
}) => {
  const router = useRouter();
  const [letterList, setLetterList] = useState<MedLetterItem[]>([]);
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const DEFAULT_TIME_START = moment().startOf("day");
  const DEFAULT_TIME_END = moment().startOf("day").add(7, "d");

  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);
  const [errorMessage, setErrorMessage] = useState("");

  const { refetch, isFetching } = api.medicine.getMedicineLetterList.useQuery(
    isTeacher
      ? {
          classId
        }
      : {
          studentId,
          classId
        },
    {
      onSuccess: (resp) => {
        resp.medicineLetterList.forEach((item) =>
          console.log(item.schoolYear, item.schoolTerm)
        );
        setLetterList(
          resp.medicineLetterList
            .map((item) => ({
              id: item.id,
              createdAt: item.createdAt,
              status: item.status ?? "NotConfirmed",
              note: item.note ?? "",
              startDate: item.startDate,
              endDate: item.endDate,
              studentName: item.studentName
            }))
            .sort((item1, item2) =>
              moment(item2.createdAt).diff(moment(item1.createdAt))
            )
        );
      },
      onError: ({ message, data }) =>
        trpcErrorHandler(() => {})(
          data?.code ?? "",
          message,
          errorContext,
          authContext
        )
    }
  );

  // fetch data when focus
  const navigation = useNavigation();
  const fetchData = () => {
    refetch().catch((e: Error) => {
      console.log(e.message);
    });
  };
  useEffect(() => {
    const focusListener = navigation.addListener("focus", fetchData);
    return focusListener;
  }, []);

  // update list on filter change
  const getFilteredLetList = () =>
    letterList.filter((item) => {
      const itemStartMoment = moment(item.startDate);
      const itemEndMoment = moment(item.endDate);
      return CheckOverlapDate(
        timeStart,
        timeEnd,
        itemStartMoment,
        itemEndMoment
      );
    });

  const ListComponent = ({
    filteredLetList
  }: {
    filteredLetList: MedLetterItem[];
  }) => (
    <ItemListWrapper
      fetchData={fetchData}
      isEmpty={filteredLetList.length == 0}
      isFetching={isFetching}
      emptyPlaceHolderText="Danh sách đơn trống"
    >
      <MedicineLetterList
        onRefresh={fetchData}
        refreshing={isFetching}
        isTeacher={isTeacher}
        items={filteredLetList}
      />
    </ItemListWrapper>
  );

  return (
    <View className="flex-1">
      <LoadingBar isFetching={isFetching} />

      <CustomStackScreen
        title={"Dặn thuốc"}
        rightButtonHandler={
          isTeacher
            ? undefined
            : () => {
                router.push({
                  pathname: "parent/medicine/add-letter-screen",
                  params: { studentId }
                });
              }
        }
      />
      <DateRangeFilterBar
        timeStart={timeStart}
        timeEnd={timeEnd}
        setTimeStart={setTimeStart}
        setTimeEnd={setTimeEnd}
      />
      <ListComponent filteredLetList={getFilteredLetList()} />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </View>
  );
};

export default MedicineHomeView;
