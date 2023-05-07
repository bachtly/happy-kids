import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { PeriodRemarkModel } from "../../../src/models/PeriodRemarkModels";
import PeriodRemarkItem from "../../../src/components/remark/PeriodRemarkItem";
import Body from "../../../src/components/Body";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import LoadingBar from "../../../src/components/common/LoadingBar";

const DEFAULT_TIME = moment(moment.now());

const PeriodRemarkScreen = ({ classId }: { classId: string }) => {
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [remarkList, setRemarkList] = useState<PeriodRemarkModel[]>([]);

  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  const remarkMutation =
    api.periodRemark.getPeriodRemarkListFromClassId.useMutation({
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
  }, [classId, isFocused, time]);

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
        renderItem={({ item }: { item: PeriodRemarkModel }) => (
          <PeriodRemarkItem
            item={item}
            isTeacher={true}
            time={time}
            refresh={refresh}
          />
        )}
      />
    </Body>
  );
};

export default PeriodRemarkScreen;
