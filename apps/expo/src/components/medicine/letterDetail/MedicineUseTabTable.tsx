import moment from "moment";
import { Moment } from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme, TextInput } from "react-native-paper";
import {
  MedicineLetterUseStatus,
  MedUseTime
} from "../../../models/MedicineModels";
import TabTableView from "../../common/TabTableView";
import DatePicker from "../../date-picker/DatePicker";
import { IsUsedDialog } from "../modals/OptionDialog";
import { IsUsedStatusText } from "../StatusText";

const MedicineUseTabTable = ({
  medUseTimes,
  setMedUseTimes,
  curBatchNumber,
  setCurBatchNumber
}: {
  medUseTimes: MedUseTime[];
  setMedUseTimes: React.Dispatch<React.SetStateAction<MedUseTime[]>>;
  curBatchNumber: number;
  setCurBatchNumber: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const theme = useTheme();
  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const onPickTime = (time: Moment) => {
    setMedUseTimes(
      medUseTimes.map((item, index) => {
        if (index != curBatchNumber) return item;
        return { ...item, date: time.toDate() };
      })
    );
  };
  const setUseStatus = (status: MedicineLetterUseStatus, note: string) => {
    setMedUseTimes(
      medUseTimes.map((item, index) => {
        if (index != curBatchNumber) return item;
        return { ...item, status: status, note: note };
      })
    );
  };

  return (
    <>
      <TabTableView
        chosenIndex={curBatchNumber}
        tabButtonPropsList={medUseTimes.map((item, index) => ({
          text: `Ngày ${moment(item.date).format("DD/MM")}`,
          onPress: () => {
            setCurBatchNumber(index);
          }
        }))}
        tabButtonAdd={() =>
          setMedUseTimes((prev) => [
            ...prev,
            { date: new Date(), note: "", status: "NotUsed" }
          ])
        }
        tabButtonRemove={(index) => {
          const newMedUseTimes = medUseTimes.filter((_, key) => key != index);
          setMedUseTimes(newMedUseTimes);

          if (index >= newMedUseTimes.length) {
            setCurBatchNumber(newMedUseTimes.length - 1);
          }
        }}
      >
        {medUseTimes[curBatchNumber] ? (
          <>
            <View className="mb-3 flex-row items-center justify-between">
              <DatePicker
                initTime={moment(medUseTimes[curBatchNumber].date)}
                setTime={onPickTime}
              />

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
                <IsUsedStatusText isUsed={medUseTimes[curBatchNumber].status} />
              </View>
            </View>

            <TextInput
              className={"text-sm"}
              placeholder="Thêm ghi chú"
              mode={"outlined"}
              multiline
              onChangeText={(value) => {
                setUseStatus(medUseTimes[curBatchNumber].status, value);
              }}
              value={medUseTimes[curBatchNumber].note}
            />

            <IsUsedDialog
              visible={visibleStatusDialog}
              origValue={medUseTimes[curBatchNumber]}
              setOrigValue={setUseStatus}
              close={() => setVisibleStatusDialog(false)}
            />
          </>
        ) : (
          <Text>Chưa ghi nhận ngày uống thuốc nào</Text>
        )}
      </TabTableView>
    </>
  );
};

export default MedicineUseTabTable;
