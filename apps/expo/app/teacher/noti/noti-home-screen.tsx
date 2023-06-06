import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../src/utils/api";
import { FlatList, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Body from "../../../src/components/Body";
import { NotiItemModel } from "../../../src/models/NotiModels";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import NotiItem from "../../../src/components/noti/NotiItem";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import LoadingBar from "../../../src/components/common/LoadingBar";

const NotiHomeScreen = () => {
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const { classId } = authContext;

  // data
  const [notis, setNotis] = useState<NotiItemModel[]>([]);

  const notiMutation = api.noti.getNotiList.useMutation({
    onSuccess: (resp) => setNotis(resp.notis),
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
  }, [isFocused]);

  const refresh = () => {
    classId &&
      notiMutation.mutate({
        classId: classId
      });
  };

  return (
    <Body>
      <LoadingBar isFetching={notiMutation.isLoading} />

      <View style={{}}>
        <FlatList
          onRefresh={() => refresh()}
          refreshing={notiMutation.isLoading}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
          data={notis}
          renderItem={({ item }: { item: NotiItemModel }) => (
            <>
              <NotiItem item={item} />
            </>
          )}
        />
      </View>
    </Body>
  );
};

export default NotiHomeScreen;
