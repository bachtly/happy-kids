import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { api } from "../../../utils/api";
import LetterStatusDialog, { IsUsedDialog } from "../modals/OptionDialog";
import LetterStatusText, {
  IsUsedStatusText,
  LetterStatus
} from "../StatusText";

const TeacherStatus = ({
  userId,
  status,
  isUsed,
  refetch,
  isFetching,
  medicineLetterId
}: {
  userId: string;
  status: LetterStatus;
  isUsed: number;
  refetch: () => void;
  isFetching: boolean;
  medicineLetterId: string;
}) => {
  const theme = useTheme();

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);

  const [visibleStatusDialog2, setVisibleStatusDialog2] = useState(false);
  const [statusIsUsed, setStatusIsUsed] = useState(isUsed);

  const isChangedLetterStatus = statusLetter != status;
  const isChangedIsUsed = isUsed != statusIsUsed;
  const isAnyChanged = isChangedLetterStatus || isChangedIsUsed;
  const isUsedEnabled = statusLetter == "Confirmed";
  const updateStatMedLetterMutation =
    api.medicine.updateMedicineLetter.useMutation({
      onSuccess: (data) => {
        if (data.status !== "Success") {
          console.log(data.message);
        } else {
          refetch();
        }
      }
    });

  useEffect(() => {
    if (!isUsedEnabled) setStatusIsUsed(0);
  }, [isUsedEnabled]);

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
      {isUsedEnabled && (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <IconButton
              icon={"pencil"}
              iconColor={theme.colors.primary}
              size={16}
              mode={"outlined"}
              onPress={() => {
                setVisibleStatusDialog2(true);
              }}
            />
            <Text className="justify-center font-bold" variant={"bodyMedium"}>
              Trạng thái uống thuốc
            </Text>
          </View>
          <View className={"flex-row items-center justify-end text-right "}>
            {isChangedIsUsed && (
              <IconButton
                icon={"undo-variant"}
                iconColor={theme.colors.backdrop}
                size={16}
                className={"-mr-1"}
                onPress={() => setStatusIsUsed(isUsed)}
              />
            )}
            <IsUsedStatusText isUsed={statusIsUsed} />
          </View>
        </View>
      )}
      <Button
        className={"my-3 w-36 self-center"}
        mode={"contained"}
        onPress={() => {
          updateStatMedLetterMutation.mutate({
            teacherId: userId,
            status: statusLetter,
            isUsed: isUsedEnabled ? statusIsUsed : 0,
            medicineLetterId
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
      <IsUsedDialog
        origValue={statusIsUsed}
        setOrigValue={setStatusIsUsed}
        visible={visibleStatusDialog2}
        close={() => setVisibleStatusDialog2(false)}
      />
    </View>
  );
};

export default TeacherStatus;
