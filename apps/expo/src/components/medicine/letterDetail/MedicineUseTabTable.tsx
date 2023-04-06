import moment from "moment";
import { Moment } from "moment";
import { useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
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
      >
        {medUseTimes[curBatchNumber] ? (
          <>
            <View className="self-center">
              <DatePicker
                initTime={moment(medUseTimes[curBatchNumber].date)}
                setTime={onPickTime}
              />
            </View>
            <View className="self-center">
              <View className="flex-row items-center">
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
                <IsUsedStatusText isUsed={medUseTimes[curBatchNumber].status} />
              </View>
            </View>

            {medUseTimes[curBatchNumber].note.length > 0 && (
              <Text className="text-center">
                {medUseTimes[curBatchNumber].note}
              </Text>
            )}
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
