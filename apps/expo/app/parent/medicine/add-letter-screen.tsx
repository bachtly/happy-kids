import { useSearchParams } from "expo-router";
import moment, { Moment } from "moment";

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import type { Item } from "../../../src/components/medicine/addLetter/MedicineList";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import SubmitComponent from "../../../src/components/common/SubmitComponent";
import MedicineBatchList from "../../../src/components/medicine/addLetter/MedicineBatchList";
import { GetTimeNumber } from "../../../src/components/medicine/TimeInDay";
import CustomCard from "../../../src/components/CustomCard";
import AlertModal from "../../../src/components/common/AlertModal";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";
import Body from "../../../src/components/Body";

const AddLetter = () => {
  const now = moment();
  const { studentId } = useSearchParams();
  const { userId } = useAuthContext();

  const [dateStart, setDateStart] = useState<Moment | null>(now);
  const [dateEnd, setDateEnd] = useState<Moment | null>(now);

  const [medicineList, setMedicineList] = useState<Item[]>([]);
  const [batchList, setBatchList] = useState<Array<Moment | null>>([now]);

  const [note, setNote] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const postMedicineLetterMutation =
    api.medicine.postMedicineLetter.useMutation({
      onError: (e) => setErrorMessage(e.message)
    });

  const onSubmit = () => {
    if (!dateStart || !dateEnd) {
      setErrorMessage("Vui lòng chọn ngày dặn thuốc");
      return;
    }

    if (medicineList.length == 0) {
      setErrorMessage("Vui lòng thêm thuốc");
      return;
    }

    if (note === "") {
      setErrorMessage("Vui lòng thêm ghi chú");
      return;
    }

    userId &&
      postMedicineLetterMutation.mutate({
        parentId: userId,
        studentId: studentId,
        startDate: dateStart.toDate(),
        endDate: dateEnd.toDate(),
        medicines: medicineList.map((item) => ({
          id: "",
          name: item.medItem.name,
          amount: item.medItem.amount,
          photo: item.medItem.photo,
          time: GetTimeNumber(
            batchList[item.batchNumber]?.hours() ?? 0,
            batchList[item.batchNumber]?.minutes() ?? 0
          ),
          batchNumber: item.batchNumber
        })),
        note: note
      });
  };

  if (!userId || !studentId) setErrorMessage(SYSTEM_ERROR_MESSAGE);

  return (
    <Body>
      <CustomStackScreen title={"Tạo đơn dặn thuốc"} />

      <ScrollView className="flex-1">
        <View className="flex-1  p-4">
          <Text className="mb-2" variant={"labelLarge"}>
            Ngày uống thuốc
          </Text>

          <CustomCard>
            <View className="flex flex-row items-center justify-center ">
              <DateRangePicker
                initTimeStart={dateStart}
                initTimeEnd={dateEnd}
                setTimeStart={setDateStart}
                setTimeEnd={setDateEnd}
              />
            </View>
          </CustomCard>

          <View className="mt-2 flex flex-row items-end justify-between">
            <Text variant={"labelLarge"}>Đơn thuốc</Text>
          </View>

          <View className="mt-2">
            <MedicineBatchList
              medicineList={medicineList}
              setMedicineList={setMedicineList}
              batchList={batchList}
              setBatchList={setBatchList}
            />
          </View>

          <Text variant={"labelLarge"} className={"mt-2"}>
            Ghi chú
          </Text>

          <TextInput
            className={"text-sm"}
            placeholder="Nhập ghi chú cho đơn dặn thuốc"
            mode={"outlined"}
            multiline
            onChangeText={(input) => setNote(input)}
            value={note}
            outlineStyle={
              errorMessage && note === "" ? { borderColor: "red" } : {}
            }
          />

          <View className={"items-center"}>
            <SubmitComponent
              isSuccess={postMedicineLetterMutation.isSuccess}
              isLoading={postMedicineLetterMutation.isLoading}
              onSubmit={onSubmit}
            />
          </View>
        </View>
      </ScrollView>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default AddLetter;
