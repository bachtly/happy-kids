import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { api } from "../../../utils/api";
import LetterStatusDialog from "../../medicine/modals/OptionDialog";
import LetterStatusText from "../../medicine/StatusText";
import { NoteThreadStatus } from "../../../models/NoteModels";

const TeacherStatus = ({
  status,
  refetch,
  noteThreadId
}: {
  userId: string;
  status: NoteThreadStatus;
  refetch: () => void;
  noteThreadId: string;
}) => {
  const theme = useTheme();

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);

  const updateStatMutation = api.note.updateNoteStatus.useMutation({
    onSuccess: (data) => {
      if (data !== null) {
        console.log(data.message);
      } else {
        refetch();
      }
    }
  });

  return (
    <View>
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text variant={"labelLarge"}>Trạng thái đơn</Text>
          <IconButton
            icon={"pencil"}
            iconColor={theme.colors.primary}
            containerColor={"rgba(0,0,0,0)"}
            size={16}
            mode={"contained"}
            onPress={() => {
              setVisibleStatusDialog(true);
            }}
          />
        </View>
        <View className={"flex-row items-center justify-end text-right"}>
          <LetterStatusText status={statusLetter} />
        </View>
      </View>

      <LetterStatusDialog
        origValue={statusLetter}
        setOrigValue={(value: NoteThreadStatus) => {
          updateStatMutation.mutate({
            noteThreadId: noteThreadId,
            status: value
          });
          setStatusLetter(value);
        }}
        visible={visibleStatusDialog}
        close={() => setVisibleStatusDialog(false)}
      />
    </View>
  );
};

export default TeacherStatus;
