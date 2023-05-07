import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import { Text, Divider } from "react-native-paper";
import {
  MedicineLetterStatus,
  MedUseTime
} from "../../../models/MedicineModels";
import TabTableView from "../../common/TabTableView";
import LetterStatusText, { IsUsedStatusText } from "../StatusText";

const ParentStatus = ({
  status,
  medUseTimes,
  updatedByTeacher
}: {
  status: MedicineLetterStatus;
  medUseTimes: MedUseTime[];
  updatedByTeacher: string | null;
}) => {
  const [curBatchNumber, setCurBatchNumber] = useState(0);

  return (
    <View>
      <View className="my-3 flex-row items-center">
        <Text variant={"labelLarge"}>Trạng thái đơn</Text>
        <View className={"flex-grow text-right"}>
          <LetterStatusText status={status} />
        </View>
      </View>
      {medUseTimes && (
        <>
          <Divider />
          <View className="py-3">
            <Text className="mb-3" variant={"labelLarge"}>
              Trạng thái uống thuốc
            </Text>

            <TabTableView
              chosenIndex={curBatchNumber}
              tabButtonPropsList={medUseTimes.map((item, index) => ({
                text: `Ngày ${moment(item.date).format("DD/MM/YYYY")}`,
                onPress: () => {
                  setCurBatchNumber(index);
                }
              }))}
            >
              {medUseTimes[curBatchNumber] ? (
                <>
                  <View className="self-center">
                    <IsUsedStatusText
                      isUsed={medUseTimes[curBatchNumber].status}
                    />
                  </View>
                  {medUseTimes[curBatchNumber].note.length > 0 && (
                    <Text className="mt-2 text-center">
                      {medUseTimes[curBatchNumber].note}
                    </Text>
                  )}
                </>
              ) : (
                <Text>Chưa ghi nhận lần uống thuốc nào</Text>
              )}
            </TabTableView>
          </View>
        </>
      )}

      {updatedByTeacher && (
        <>
          <Divider />
          <View className="flex-row items-center py-3">
            <Text variant={"labelLarge"}>Cập nhật lần cuối bởi</Text>
            <Text className={"flex-grow text-right"}>{updatedByTeacher}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ParentStatus;
