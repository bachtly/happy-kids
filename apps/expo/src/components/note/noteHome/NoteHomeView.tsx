import { useNavigation, useRouter } from "expo-router";
import moment, { Moment } from "moment";

import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { NoteThreadList } from "./NoteThreadList";
import CustomStackScreen from "../../CustomStackScreen";
import DateRangeFilterBar from "../../date-picker/DateRangeFilterBar";
import ItemListWrapper from "../../common/ItemListWrapper";
import { NoteThread } from "../../../models/NoteModels";
import { api } from "../../../utils/api";
import LoadingBar from "../../common/LoadingBar";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import { ErrorContext } from "../../../utils/error-context";
import { useAuthContext } from "../../../utils/auth-context-provider";

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

const NoteHomeView = ({
  isTeacher,
  classId,
  studentId
}: {
  isTeacher: boolean;
  classId: string;
  studentId: string;
}) => {
  const router = useRouter();
  const errorContext = useContext(ErrorContext);
  const authContext = useAuthContext();
  const [threadList, setThreadList] = useState<NoteThread[]>([]);

  const DEFAULT_TIME_START = moment().startOf("day");
  const DEFAULT_TIME_END = moment().startOf("day").add(7, "d");

  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  const { refetch, isFetching } = api.note.getNoteThreadList.useQuery(
    isTeacher
      ? {
          classId
        }
      : {
          studentId
        },
    {
      onSuccess: (resp) => {
        setThreadList(
          resp.noteThreadList
            .map((item) => ({
              id: item.id,
              createdAt: item.createdAt,
              status: item.status,
              startDate: item.startDate,
              endDate: item.endDate,
              studentName: item.studentName,
              content: item.content
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
    threadList.filter((item) => {
      const itemStartMoment = moment(item.startDate);
      const itemEndMoment = item.endDate ? moment(item.endDate) : timeEnd;
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
    filteredLetList: NoteThread[];
  }) => (
    <ItemListWrapper
      fetchData={fetchData}
      isEmpty={filteredLetList.length == 0}
      isFetching={isFetching}
      emptyPlaceHolderText="Danh sách đơn trống"
    >
      <NoteThreadList
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
        title={"Lời nhắn"}
        rightButtonHandler={
          isTeacher
            ? undefined
            : () => {
                router.push({
                  pathname: "parent/note/add-letter-screen",
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
    </View>
  );
};

export default NoteHomeView;
