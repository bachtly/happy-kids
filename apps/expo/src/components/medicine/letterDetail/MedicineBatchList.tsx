import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { GetHourAndMinute } from "../TimeInDay";
import DetailMedicineList, { Item as Item2 } from "./DetailMedicineList";
import TabTableView from "../../common/TabTableView";

interface Item {
  id: string;
  name: string;
  amount: string;
  photo: string;
  time: number;
  batchNumber: number;
}

const MedicineBatchList = ({
  medicineList,
  batchList
}: {
  medicineList: Item[];
  batchList: number[];
}) => {
  const [curBatchNumber, setCurBatchNumber] = useState(0);
  const getBatchMedicineList = (batchNumber: number): Item2[] => {
    return medicineList
      .filter((item) => item.batchNumber == batchNumber)
      .map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        photo: item.photo
      }));
  };
  const displayMedicineList = getBatchMedicineList(curBatchNumber);
  const getTimeText = (momentInNumber: number): string => {
    const time = GetHourAndMinute(momentInNumber);
    return `${time[0]?.toString().padStart(2, "0")}:${time[1]
      ?.toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <TabTableView
        chosenIndex={curBatchNumber}
        tabButtonPropsList={batchList.map((item, index) => ({
          text: `Cử ${index + 1}${item ? ` - ${getTimeText(item)}` : ""}`,
          onPress: () => {
            setCurBatchNumber(index);
          }
        }))}
      >
        {displayMedicineList.length > 0 ? (
          <View>
            <DetailMedicineList items={displayMedicineList} />
          </View>
        ) : (
          <Text className={"mb-2 text-center leading-6"}>
            Cử này không có thuốc nào!{" "}
          </Text>
        )}
      </TabTableView>
    </>
  );
};

export default MedicineBatchList;
