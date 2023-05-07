import { FlatList } from "react-native";
import { api } from "../../../src/utils/api";
import React, { useContext, useEffect, useState } from "react";
import { DailyRemarkModel } from "../../../src/models/DailyRemarkModels";
import { useIsFocused } from "@react-navigation/native";
import moment, { Moment } from "moment";
import DailyRemarkItem from "../../../src/components/remark/DailyRemarkItem";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";
import Body from "../../../src/components/Body";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import LoadingBar from "../../../src/components/common/LoadingBar";

const DEFAULT_TIME = moment(moment.now());

const DailyRemarkScreen = ({ classId }: { classId: string }) => {
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [remarkList, setRemarkList] = useState<DailyRemarkModel[]>([]);
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  const remarkMutation =
    api.dailyRemark.getDailyRemarkListFromClassId.useMutation({
      onSuccess: (resp) => setRemarkList(resp.remarks),
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
  }, [classId, time, isFocused]);

  const refresh = () => {
    remarkMutation.mutate({
      time: time.toDate(),
      classId: classId ?? ""
    });
  };

  const isLoading = () => remarkMutation.isLoading;

  return (
    <Body>
      <LoadingBar isFetching={isLoading()} />

      <DateFilterBar time={time} setTime={setTime} />

      <FlatList
        onRefresh={() => refresh()}
        refreshing={isLoading()}
        contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
        data={remarkList}
        renderItem={({ item }: { item: DailyRemarkModel }) => (
          <DailyRemarkItem
            item={item}
            isTeacher={true}
            refresh={refresh}
            date={time.toDate()}
          />
        )}
      />
    </Body>
  );
};

export default DailyRemarkScreen;
