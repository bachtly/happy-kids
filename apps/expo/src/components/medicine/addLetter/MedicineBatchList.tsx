import moment from "moment";
import { Moment } from "moment";
import { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { MedicineModel } from "../../../models/MedicineModels";
import TimePicker from "../../TimePicker";
import { ConfirmModal } from "../../common/ConfirmModal";
import MedicineModal from "../modals/MedicineModal";
import MedicineList, { Item } from "./MedicineList";
import TabTableView from "../../common/TabTableView";

const MedicineBatchList = ({
  medicineList,
  batchList,
  setBatchList,
  setMedicineList
}: {
  medicineList: Item[];
  batchList: Array<Moment | null>;
  setBatchList: React.Dispatch<React.SetStateAction<Array<Moment | null>>>;
  setMedicineList: React.Dispatch<React.SetStateAction<Item[]>>;
}) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [modifyModalVisible, setModifyModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const addNewMedicine = (medicine: Item) => {
    for (let i = 0; i < medicineList.length; i++) {
      if (medicineList[i]?.id == medicine.id) {
        return;
      }
    }
    setMedicineList((prev) => [...prev, medicine]);
  };
  const changeMedicine = (medicine: Item) => {
    if (!medicine.id) return;
    const newList = medicineList.map((item) => {
      if (item.id === medicine.id) return medicine;
      else return item;
    });
    setMedicineList(newList);
  };
  const deleteMedicine = (medicineId: string) => {
    setMedicineList((prev) => prev.filter((v) => v.id !== medicineId));
  };

  const [maxId, setMaxId] = useState(0);
  const [curId, setCurId] = useState("");
  const [curBatchNumber, setCurBatchNumber] = useState(0);
  const [curMed, setCurMed] = useState<MedicineModel>({
    name: "",
    amount: "",
    photo: ""
  });

  const onPickTime = (time: Moment | null) => {
    setBatchList(
      batchList.map((item, index) => {
        if (index != curBatchNumber) return item;
        return time;
      })
    );
  };
  const getBatchMedicineList = (batchNumber: number) => {
    return medicineList.filter((item) => item.batchNumber == batchNumber);
  };
  const displayMedicineList = getBatchMedicineList(curBatchNumber);

  return (
    <>
      <TabTableView
        chosenIndex={curBatchNumber}
        tabButtonPropsList={batchList.map((item, index) => ({
          text: `Cử ${index + 1}${item ? ` - ${item.format("HH:mm")}` : ""}`,
          onPress: () => {
            setCurBatchNumber(index);
          }
        }))}
        tabButtonAdd={() => setBatchList((prev) => [...prev, moment()])}
      >
        <View>
          <View className="mb-2 flex flex-row items-center justify-center ">
            <TimePicker time={batchList[curBatchNumber]} setTime={onPickTime} />
          </View>
          {displayMedicineList.length > 0 ? (
            <View>
              <MedicineList items={displayMedicineList} />
            </View>
          ) : (
            <Text className={"mb-2 text-center leading-6"}>
              Hiện tại chưa có thuốc nào được thêm, nhấn thêm thuốc để thêm.{" "}
            </Text>
          )}
          <Button
            mode={"elevated"}
            onPress={() => {
              setCurId(maxId.toString());
              setCurMed({
                name: "",
                amount: "",
                photo: ""
              });
              setAddModalVisible(true);
            }}
          >
            Thêm&nbsp;thuốc
          </Button>
        </View>
      </TabTableView>
      <MedicineModal
        title="Thêm thuốc"
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
        }}
        onConfirm={() => {
          addNewMedicine({
            id: curId,
            batchNumber: curBatchNumber,
            medItem: curMed,
            onModify: () => {
              setCurId(curId);
              setCurMed(curMed);
              setModifyModalVisible(true);
            },
            onDelete: () => {
              setCurId(curId);
              setConfirmModalVisible(true);
            }
          });
          setMaxId(maxId + 1);
        }}
        medicine={curMed}
        setMedicine={setCurMed}
      />
      <MedicineModal
        title="Sửa thuốc"
        visible={modifyModalVisible}
        onClose={() => {
          setModifyModalVisible(false);
        }}
        onConfirm={() => {
          changeMedicine({
            id: curId,
            batchNumber: curBatchNumber,
            medItem: curMed,
            onModify: () => {
              setCurId(curId);
              setCurMed(curMed);
              setModifyModalVisible(true);
            },
            onDelete: () => {
              setCurId(curId);
              setConfirmModalVisible(true);
            }
          });
        }}
        medicine={curMed}
        setMedicine={setCurMed}
      />
      <ConfirmModal
        title={"Xóa thuốc"}
        message={"Bạn có chác muốn xóa thuốc?"}
        visible={confirmModalVisible}
        onClose={() => {
          setConfirmModalVisible(false);
        }}
        onConfirm={() => {
          setConfirmModalVisible(false);
          deleteMedicine(curId);
        }}
      />
    </>
  );
};

export default MedicineBatchList;
