import React, { useContext, useState } from "react";
import { View, TextInput } from "react-native";
import { useTheme } from "react-native-paper";
import { api } from "../../../utils/api";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import { ErrorContext } from "../../../utils/error-context";
import { useAuthContext } from "../../../utils/auth-context-provider";
import Ionicons from "react-native-vector-icons/Ionicons";

const MessageComponent = ({
  userId,
  refetch,
  noteThreadId
}: {
  userId: string;
  refetch: () => void;
  noteThreadId: string;
}) => {
  const errorContext = useContext(ErrorContext);
  const authContext = useAuthContext();
  const { colors } = useTheme();

  const [mess, setMess] = useState("");
  const postNoteMessageMutation = api.note.postNoteMessage.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const onSubmit = () => {
    if (mess.trim() === "") return;
    postNoteMessageMutation.mutate({
      message: {
        content: mess.trim(),
        createdAt: new Date(),
        id: "",
        userId: userId
      },
      noteThreadId: noteThreadId
    });
    setMess("");
  };

  return (
    <View
      className={"flex-row space-x-2"}
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.outline,
        paddingVertical: 8,
        paddingHorizontal: 16
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: colors.outline,
          paddingVertical: 8,
          paddingHorizontal: 12
        }}
      >
        <TextInput
          placeholder={"Viết bình luận..."}
          multiline
          style={{ maxHeight: 200 }}
          onChangeText={(text) => setMess(text)}
          value={mess}
        />
      </View>
      <Ionicons
        name={"send-sharp"}
        size={30}
        color={colors.primary}
        style={{ paddingTop: 8 }}
        onPress={() => {
          onSubmit();
        }}
      />
    </View>
  );
};

export default MessageComponent;
