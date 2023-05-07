import React, { useContext, useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { LeaveLetterStatus } from "../../../models/LeaveLetterModels";
import { api } from "../../../utils/api";
import LetterStatusDialog from "../../medicine/modals/OptionDialog";
import LetterStatusText from "../../medicine/StatusText";
import { ErrorContext } from "../../../utils/error-context";
import { useAuthContext } from "../../../utils/auth-context-provider";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";

const TeacherStatus = ({
  status,
  refetch,
  leaveLetterId
}: {
  status: LeaveLetterStatus;
  refetch: () => void;
  isFetching: boolean;
  leaveLetterId: string;
}) => {
  const theme = useTheme();
  const errorContext = useContext(ErrorContext);
  const authContext = useAuthContext();

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);

  const updateStatMedLetterMutation =
    api.leaveletter.updateMedicineLetter.useMutation({
      onSuccess: (_) => refetch(),
      onError: ({ message, data }) =>
        trpcErrorHandler(() => {})(
          data?.code ?? "",
          message,
          errorContext,
          authContext
        )
    });

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
        setOrigValue={(value) => {
          updateStatMedLetterMutation.mutate({
            status: value,
            leaveLetterId
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
