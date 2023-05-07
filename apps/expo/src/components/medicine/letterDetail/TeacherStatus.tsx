import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  useTheme,
  Divider
} from "react-native-paper";
import {
  MedicineLetterStatus,
  MedUseTime
} from "../../../models/MedicineModels";
import { api } from "../../../utils/api";
import LetterStatusDialog from "../modals/OptionDialog";
import LetterStatusText from "../StatusText";
import MedicineUseTabTable from "./MedicineUseTabTable";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import { useAuthContext } from "../../../utils/auth-context-provider";
import { ErrorContext } from "../../../utils/error-context";

const TeacherStatus = ({
  userId,
  status,
  refetch,
  isFetching,
  medicineLetterId,
  medUseTimes
}: {
  userId: string;
  status: MedicineLetterStatus;
  refetch: () => void;
  isFetching: boolean;
  medicineLetterId: string;
  medUseTimes: MedUseTime[];
}) => {
  const theme = useTheme();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);
  const [curMedUseTimes, setCurMedUseTimes] = useState(medUseTimes);
  const [curBatchNumber, setCurBatchNumber] = useState(0);

  const isChangedLetterStatus = statusLetter != status;
  const isChangedUseStatus =
    JSON.stringify(curMedUseTimes) != JSON.stringify(medUseTimes);
  const isAnyChanged = isChangedLetterStatus || isChangedUseStatus;
  const updateStatMedLetterMutation =
    api.medicine.updateMedicineLetter.useMutation({
      onSuccess: (_) => refetch(),
      onError: ({ message, data }) =>
        trpcErrorHandler(() => {})(
          data?.code ?? "",
          message,
          errorContext,
          authContext
        )
    });

  useEffect(() => {
    setCurMedUseTimes(medUseTimes);
    setCurBatchNumber(0);
  }, [medUseTimes]);
  useEffect(() => setStatusLetter(statusLetter), [status]);

  return (
    <View>
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text variant={"labelLarge"}>Trạng thái đơn</Text>
        </View>
        <View className={"flex-row items-center justify-end text-right"}>
          <IconButton
            icon={"pencil"}
            iconColor={theme.colors.primary}
            size={16}
            mode={"outlined"}
            onPress={() => {
              setVisibleStatusDialog(true);
            }}
          />
          <LetterStatusText status={statusLetter} />
        </View>
      </View>

      <Divider />
      <View className={"space-y-1 py-3"}>
        <View className="flex-row items-baseline justify-between">
          <Text className="mb-3" variant={"labelLarge"}>
            Trạng thái uống thuốc
          </Text>
          {isChangedUseStatus && (
            <IconButton
              icon={"undo-variant"}
              iconColor={theme.colors.backdrop}
              size={16}
              onPress={() => {
                setCurMedUseTimes(medUseTimes);
                setCurBatchNumber(0);
              }}
            />
          )}
        </View>
        <MedicineUseTabTable
          medUseTimes={curMedUseTimes}
          setMedUseTimes={setCurMedUseTimes}
          curBatchNumber={curBatchNumber}
          setCurBatchNumber={setCurBatchNumber}
        />
      </View>
      <Button
        className={"my-3 w-36 self-center"}
        mode={"contained"}
        onPress={() => {
          isChangedUseStatus &&
            updateStatMedLetterMutation.mutate({
              teacherId: userId,
              useDiary: curMedUseTimes,
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
        setOrigValue={(value) => {
          updateStatMedLetterMutation.mutate({
            teacherId: userId,
            status: value,
            medicineLetterId
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
