import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { MedicineLetterStatus } from "../../../models/MedicineModels";
import LetterStatusDialog from "../modals/OptionDialog";
import LetterStatusText from "../StatusText";

const TeacherStatus = ({
  status,
  setStatus
}: {
  status: MedicineLetterStatus;
  setStatus: (status: MedicineLetterStatus) => void;
}) => {
  const theme = useTheme();

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);

  useEffect(() => setStatus(status), [status]);

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
          <LetterStatusText status={status} />
        </View>
      </View>

      <LetterStatusDialog
        origValue={status}
        setOrigValue={(value) => {
          setStatus(value);
        }}
        visible={visibleStatusDialog}
        close={() => setVisibleStatusDialog(false)}
      />
    </View>
  );
};

export default TeacherStatus;
