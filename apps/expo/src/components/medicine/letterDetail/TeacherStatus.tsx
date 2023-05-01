import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import {
  MedicineLetterStatus,
  MedUseTime
} from "../../../models/MedicineModels";
import { api } from "../../../utils/api";
import LetterStatusDialog from "../modals/OptionDialog";
import LetterStatusText from "../StatusText";
import MedicineUseTabTable from "./MedicineUseTabTable";
import AlertModal from "../../common/AlertModal";

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

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);
  const [curMedUseTimes, setCurMedUseTimes] = useState(medUseTimes);
  const [curBatchNumber, setCurBatchNumber] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const isChangedLetterStatus = statusLetter != status;
  const isChangedUseStatus =
    JSON.stringify(curMedUseTimes) != JSON.stringify(medUseTimes);
  const isAnyChanged = isChangedLetterStatus || isChangedUseStatus;
  const updateStatMedLetterMutation =
    api.medicine.updateMedicineLetter.useMutation({
      onSuccess: (_) => refetch(),
      onError: (e) => setErrorMessage(e.message)
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

      <View className="mb-3">
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
          updateStatMedLetterMutation.mutate({
            teacherId: userId,
            status: statusLetter,
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
        setOrigValue={setStatusLetter}
        visible={visibleStatusDialog}
        close={() => setVisibleStatusDialog(false)}
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </View>
  );
};

export default TeacherStatus;
