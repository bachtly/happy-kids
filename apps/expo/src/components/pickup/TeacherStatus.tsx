import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { api } from "../../utils/api";
import LetterStatusDialog from "../medicine/modals/OptionDialog";
import LetterStatusText from "../medicine/StatusText";
import { MedicineLetterStatus } from "../../models/MedicineModels";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import { useAuthContext } from "../../utils/auth-context-provider";
import { ErrorContext } from "../../utils/error-context";

const TeacherStatus = ({
  status,
  refetch,
  id
}: {
  userId: string;
  status: MedicineLetterStatus;
  refetch: () => void;
  id: string;
}) => {
  const theme = useTheme();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [changed, setChanged] = useState(false);
  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);

  const confirmMutation = api.pickup.confirmPickupLetter.useMutation({
    onSuccess: () => setChanged(!changed),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const rejectMutation = api.pickup.rejectPickupLetter.useMutation({
    onSuccess: () => setChanged(!changed),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  useEffect(() => refetch(), [changed]);

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

      <LetterStatusDialog
        origValue={statusLetter}
        setOrigValue={(value: MedicineLetterStatus) => {
          if (value == "Confirmed") {
            confirmMutation.mutate({ id });
          } else if (value == "Rejected") {
            rejectMutation.mutate({ id });
          }
          setStatusLetter(value);
        }}
        visible={visibleStatusDialog}
        close={() => setVisibleStatusDialog(false)}
      />
    </View>
  );
};

export default TeacherStatus;
