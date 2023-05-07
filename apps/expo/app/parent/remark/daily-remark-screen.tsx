import { FlatList } from "react-native";
import { api } from "../../../src/utils/api";
import React, { useContext, useEffect, useState } from "react";
import { DailyRemarkModel } from "../../../src/models/DailyRemarkModels";
import { useIsFocused } from "@react-navigation/native";
import moment, { Moment } from "moment";
import DailyRemarkItem from "../../../src/components/remark/DailyRemarkItem";
import DateRangeFilterBar from "../../../src/components/date-picker/DateRangeFilterBar";
import Body from "../../../src/components/Body";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import LoadingBar from "../../../src/components/common/LoadingBar";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const DailyRemarkScreen = ({ studentId }: { studentId: string }) => {
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [remarkList, setRemarkList] = useState<DailyRemarkModel[]>([]);
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  const remarkMutation = api.dailyRemark.getDailyRemarkList.useMutation({
    onSuccess: (resp) => setRemarkList(resp.remarks),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const refresh = () => {
    remarkMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  };

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [studentId, timeStart, timeEnd, isFocused]);

  const isLoading = () => remarkMutation.isLoading;

  return (
    <Body>
      <LoadingBar isFetching={isLoading()} />

      <DateRangeFilterBar
        timeStart={timeStart}
        setTimeStart={setTimeStart}
        timeEnd={timeEnd}
        setTimeEnd={setTimeEnd}
      />

      <FlatList
        onRefresh={() => refresh()}
        refreshing={isLoading()}
        contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
        data={remarkList}
        renderItem={({ item }: { item: DailyRemarkModel }) => (
          <DailyRemarkItem item={item} isTeacher={false} />
        )}
      />
    </Body>
  );
};

export default DailyRemarkScreen;
