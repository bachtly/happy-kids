import React, { useContext, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import { useNavigation } from "expo-router";
import "querystring";
import { api } from "../../../utils/api";
import { useAuthContext } from "../../../utils/auth-context-provider";
import { ErrorContext } from "../../../utils/error-context";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import MessageComponent from "./MessageComponent";
import LoadingBar from "../../common/LoadingBar";
import { NoteMessageList } from "./NoteMessageList";
import CustomWhiteStackScreen from "../../CustomWhiteStackScreen";

const ThreadView = ({ userId, id }: { userId: string; id: string }) => {
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const { colors } = useTheme();

  const { data, refetch, isFetching } = api.note.getNoteThread.useQuery(
    {
      noteThreadId: id
    },
    {
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
    void refetch();
  };
  useEffect(() => {
    const focusListener = navigation.addListener("focus", fetchData);
    return focusListener;
  }, []);

  return (
    <View className={"flex-1"} style={{ backgroundColor: colors.background }}>
      <LoadingBar isFetching={isFetching} />

      <CustomWhiteStackScreen title={"Phản hồi"} />

      <View style={{ padding: 10, flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={fetchData} />
          }
        >
          {data?.noteThread && data.noteThread.messages.length > 0 ? (
            <NoteMessageList
              userId={userId}
              items={data.noteThread.messages.map((item) => {
                // console.log(item.userId);
                return {
                  sendUser: item.user,
                  content: item.content,
                  id: item.id,
                  sendTime: item.createdAt,
                  sendUserId: item.userId
                };
              })}
            />
          ) : (
            <NoteMessageList userId={userId} items={[]} />
          )}
        </ScrollView>
      </View>

      <MessageComponent userId={userId} noteThreadId={id} refetch={fetchData} />
    </View>
  );
};

export default ThreadView;
