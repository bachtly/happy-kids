import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-native-paper";
import { useSearchParams } from "expo-router";
import { api } from "../../../src/utils/api";
import { FlatList, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Body from "../../../src/components/Body";
import { NotiItemModel } from "../../../src/models/NotiModels";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import NotiItem from "../../../src/components/noti/NotiItem";

const NotiHomeScreen = () => {
  const { userId } = useAuthContext();
  const { classId } = useSearchParams();
  const isFocused = useIsFocused();

  // data
  const [notis, setNotis] = useState<NotiItemModel[]>([]);

  const notiMutation = api.noti.getNotiList.useMutation({
    onSuccess: (resp) => setNotis(resp.notis)
  });

  // update list when search criterias change
  useEffect(() => {
    refresh();
  }, [isFocused]);

  const refresh = () => {
    userId &&
      classId &&
      notiMutation.mutate({
        userId: userId,
        classId: classId
      });
  };

  return (
    <Body>
      {notiMutation.isLoading && <ProgressBar indeterminate visible={true} />}

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
