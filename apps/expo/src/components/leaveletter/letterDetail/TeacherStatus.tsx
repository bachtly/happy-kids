import React, { useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { api } from "../../../utils/api";
import LetterStatusDialog from "../../medicine/modals/OptionDialog";
import LetterStatusText, { LetterStatus } from "../../medicine/StatusText";

const TeacherStatus = ({
  userId,
  status,
  refetch,
  isFetching,
  leaveLetterId
}: {
  userId: string;
  status: LetterStatus;
  refetch: () => void;
  isFetching: boolean;
  leaveLetterId: string;
}) => {
  const theme = useTheme();

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);

  const isChangedLetterStatus = statusLetter != status;
  const isAnyChanged = isChangedLetterStatus;
  const updateStatMedLetterMutation =
    api.leaveletter.updateMedicineLetter.useMutation({
      onSuccess: (data) => {
        if (data.status !== "Success") {
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
          <IconButton
            icon={"pencil"}
            iconColor={theme.colors.primary}
            size={16}
            mode={"outlined"}
            onPress={() => {
              setVisibleStatusDialog(true);
            }}
          />
          <Text className="font-bold" variant={"bodyMedium"}>
            Trạng thái đơn
          </Text>
        </View>
        <View className={"flex-row items-center justify-end text-right"}>
          {isChangedLetterStatus && (
            <IconButton
              icon={"undo-variant"}
              iconColor={theme.colors.backdrop}
              size={16}
              className={"-mr-1"}
              onPress={() => setStatusLetter(status)}
            />
          )}
          <LetterStatusText status={statusLetter} />
        </View>
      </View>
      <Button
        className={"my-3 w-36 self-center"}
        mode={"contained"}
        onPress={() => {
          updateStatMedLetterMutation.mutate({
            teacherId: userId,
            status: statusLetter,
            leaveLetterId
          });
        }}
        disabled={
          !isAnyChanged || updateStatMedLetterMutation.isLoading || isFetching
        }
        icon={!isAnyChanged ? "check" : undefined}
        loading={updateStatMedLetterMutation.isLoading}
      >
        {isAnyChanged
          ? updateStatMedLetterMutation.isLoading
            ? "Đang gửi"
            : "Cập nhật"
          : "Đã cập nhật"}
      </Button>
      <LetterStatusDialog
        origValue={statusLetter}
        setOrigValue={setStatusLetter}
        visible={visibleStatusDialog}
        close={() => setVisibleStatusDialog(false)}
      />
    </View>
  );
};

export default TeacherStatus;
