import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Button } from "react-native-paper";
import { api } from "../../../utils/api";

const MessageComponent = ({
  userId,
  refetch,
  noteThreadId
}: {
  userId: string;
  refetch: () => void;
  noteThreadId: string;
}) => {
  const [mess, setMess] = useState("");
  const postNoteMessageMutation = api.note.postNoteMessage.useMutation({
    onSuccess: (err) => {
      if (err !== null) {
        console.log(err.message);
      } else {
        refetch();
      }
    }
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
    <View className="flex-row items-center border-t">
      <TextInput
        className="max-h-24 w-1 flex-grow border-r px-2"
        multiline
        value={mess}
        onChangeText={setMess}
        placeholder="Nhập bình luận"
      />
      <Button mode="text" onPress={onSubmit}>
        Gửi
      </Button>
    </View>
  );
};

export default MessageComponent;
