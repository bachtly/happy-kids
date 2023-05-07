import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../src/utils/api";
import { FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { PeriodRemarkModel } from "../../../src/models/PeriodRemarkModels";
import PeriodRemarkItem from "../../../src/components/remark/PeriodRemarkItem";
import Body from "../../../src/components/Body";
import moment from "moment";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import LoadingBar from "../../../src/components/common/LoadingBar";

const PeriodRemarkScreen = ({ studentId }: { studentId: string }) => {
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [remarkList, setRemarkList] = useState<PeriodRemarkModel[]>([]);

  const remarkMutation = api.periodRemark.getPeriodRemarkList.useMutation({
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
  }, [studentId, isFocused]);

  const refresh = () => {
    remarkMutation.mutate({
      studentId: studentId ?? ""
    });
  };

  const isLoading = () => remarkMutation.isLoading;

  return (
    <Body>
      <LoadingBar isFetching={isLoading()} />

      <FlatList
        onRefresh={() => refresh()}
        refreshing={isLoading()}
        contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
        data={remarkList}
        renderItem={({ item }: { item: PeriodRemarkModel }) => (
          <PeriodRemarkItem item={item} isTeacher={false} time={moment()} />
        )}
      />
    </Body>
  );
};

export default PeriodRemarkScreen;
