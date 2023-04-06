import { useRouter, useSearchParams } from "expo-router";
import moment, { Moment } from "moment";

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { FormError } from "../../../src/components/AlertError";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import type { Item } from "../../../src/components/medicine/addLetter/MedicineList";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import SubmitComponent from "../../../src/components/common/SubmitComponent";
import LetterSubmitAlert from "../../../src/components/common/LetterSubmitAlert";
import MedicineBatchList from "../../../src/components/medicine/addLetter/MedicineBatchList";
import { GetTimeNumber } from "../../../src/components/medicine/TimeInDay";
import CustomCard from "../../../src/components/CustomCard";

const AddLetter = () => {
  const now = moment();
  const router = useRouter();
  const { studentId } = useSearchParams();
  const { userId } = useAuthContext();
  if (!userId || !studentId)
    throw Error("missing params in medicine add letter screen");

  const [alertModalVisible, setAlertModalVisible] = useState(false);

  const [dateStart, setDateStart] = useState<Moment | null>(now);
  const [dateEnd, setDateEnd] = useState<Moment | null>(now);

  const [medicineList, setMedicineList] = useState<Item[]>([]);
  const [batchList, setBatchList] = useState<Array<Moment | null>>([now]);

  const [note, setNote] = useState("");

  const [submitError, setSubmitError] = useState<FormError[]>([]);

  const postMedicineLetterMutation =
    api.medicine.postMedicineLetter.useMutation({
      onSuccess: (data) => {
        if (data.medicineLetterId !== "") {
          setSubmitError([]);
        } else {
          console.log(data.message);
          setSubmitError(["other"]);
        }
        setAlertModalVisible(true);
      }
    });

  const onSubmit = () => {
    setSubmitError([]);
    if (!dateStart || !dateEnd || medicineList.length == 0 || note === "") {
      if (!dateStart || !dateEnd)
        setSubmitError((prev) => [...prev, "medicine_missing_datetime"]);
      if (medicineList.length == 0)
        setSubmitError((prev) => [...prev, "medicine_missing_medicine"]);
      if (note === "")
        setSubmitError((prev) => [...prev, "medicine_empty_note"]);

      setAlertModalVisible(true);
      return;
    }
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

  return (
    <View className="flex-1">
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
              submitError.includes("medicine_empty_note") && note === ""
                ? {
                    borderColor: "red"
                  }
                : {}
            }
          />

          <View className={"items-center"}>
            <SubmitComponent
              isSuccess={
                postMedicineLetterMutation.isSuccess && submitError.length == 0
              }
              isLoading={postMedicineLetterMutation.isLoading}
              onSubmit={onSubmit}
            />
          </View>
        </View>
      </ScrollView>

      <LetterSubmitAlert
        visible={alertModalVisible}
        setVisible={setAlertModalVisible}
        submitError={submitError}
        afterSubmitSuccess={() => router.back()}
      />
    </View>
  );
};

export default AddLetter;
