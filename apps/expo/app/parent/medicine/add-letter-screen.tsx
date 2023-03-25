import { Stack, useRouter, useSearchParams } from "expo-router";
import moment, { Moment } from "moment";

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import DateRangePicker from "../../../src/components/DateRangePicker";
import type { Item } from "../../../src/components/medicine/addLetter/MedicineList";
import MedicineList from "../../../src/components/medicine/addLetter/MedicineList";
import AlertModal from "../../../src/components/medicine/modals/AlertModal";
import { ConfirmModal } from "../../../src/components/medicine/modals/ConfirmModal";
import MedicineModal from "../../../src/components/medicine/modals/MedicineModal";
import UnderlineButton from "../../../src/components/medicine/UnderlineButton";
import TimePicker from "../../../src/components/TimePicker";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";

const AddLetter = () => {
  const now = moment();
  const theme = useTheme();
  const { studentId } = useSearchParams();
  const { userId } = useAuthContext();
  if (!userId || !studentId)
    throw Error("missing params in medicine add letter screen");

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [modifyModalVisible, setModifyModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  const [dateStart, setDateStart] = useState<Moment | null>(now);
  const [dateEnd, setDateEnd] = useState<Moment | null>(now);
  const [time, setTime] = useState<Moment | null>(now);

  const [medicineList, setMedicineList] = useState<Item[]>([]);
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
  const [curMedName, setCurMedName] = useState("");
  const [curMedAmount, setCurMedAmount] = useState("");
  const [curMedPhoto, setCurMedPhoto] = useState("");
  const [note, setNote] = useState("");

  const [submitError, setSubmitError] = useState<Array<string>>([]);

  const router = useRouter();
  const postMedicineLetterMutation =
    api.medicine.postMedicineLetter.useMutation({
      onSuccess: (data) => {
        if (data.medicineLetterId !== "") {
          setSubmitError([]);
        } else {
          console.log(data.message);
          setSubmitError([data.message]);
        }
        setAlertModalVisible(true);
      }
    });

  const submitErrorValues = {
    datetime: "missing datetime",
    emptyMedList: "empty medicine list",
    emptyNote: "emptyNote"
  };
  const onSubmit = () => {
    setSubmitError([]);
    if (
      !dateStart ||
      !dateEnd ||
      !time ||
      medicineList.length == 0 ||
      note === ""
    ) {
      if (!dateStart || !dateEnd || !time)
        setSubmitError((prev) => [...prev, submitErrorValues.datetime]);
      if (medicineList.length == 0)
        setSubmitError((prev) => [...prev, submitErrorValues.emptyMedList]);
      if (note === "")
        setSubmitError((prev) => [...prev, submitErrorValues.emptyNote]);

      setAlertModalVisible(true);
      return;
    }
    postMedicineLetterMutation.mutate({
      parentId: userId,
      studentId: studentId,
      startDate: dateStart.toDate(),
      endDate: dateEnd.toDate(),
      time: time.hours() * 60 + time.minutes(),
      medicines: medicineList.map((item) => ({
        id: "",
        name: item.name,
        amount: item.amount,
        photo: item.photo
      })),
      note: note
    });
  };
  const getErrorMess = (error: string) => {
    if (error == submitErrorValues.datetime)
      return "Chưa chọn ngày/giờ uống thuốc";
    if (error == submitErrorValues.emptyMedList) return "Thêm ít nhất 1 thuốc";
    if (error == submitErrorValues.emptyNote) return "Chưa nhập ghi chú";
    return error;
  };
  const AlertComponent = () => (
    <AlertModal
      title={
        submitError.length == 0 ? "Tạo đơn thành công" : "Tạo đơn thất bại"
      }
      visible={alertModalVisible}
      onClose={() => {
        setAlertModalVisible(false);
        if (submitError.length == 0) {
          router.back();
        }
      }}
      message={
        submitError.length == 0
          ? "Bạn đã tạo đơn thành công, vui lòng chờ đơn được giáo viên xử lý"
          : `Lỗi:\n${submitError
              .map((mess) => `\t${getErrorMess(mess)}`)
              .join("\n")}`
      }
    />
  );
  const SubmitComponent = () => {
    if (postMedicineLetterMutation.isSuccess && submitError.length == 0)
      return (
        <Button
          className={"mt-5 w-36"}
          mode={"contained"}
          disabled
          icon={"check"}
        >
          Gửi thành công
        </Button>
      );
    if (postMedicineLetterMutation.isLoading)
      return (
        <Button className={"mt-5 w-36"} mode={"contained"} disabled loading>
          Đang gửi
        </Button>
      );
    return (
      <Button
        className={"mt-5 w-36"}
        mode={"contained"}
        onPress={() => {
          onSubmit();
        }}
      >
        Xác nhận
      </Button>
    );
  };
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "Tạo đơn dặn thuốc",
          animation: "default"
        }}
      />

      <ScrollView className="flex-1">
        <View className="flex-1  p-4">
          <Text className="mb-2" variant={"labelLarge"}>
            Ngày giờ uống thuốc
          </Text>

          <View
            className="space-y-2 rounded-sm border p-4"
            style={{
              backgroundColor: theme.colors.background,
              borderColor:
                submitError.includes(submitErrorValues.datetime) &&
                (!dateStart || !dateEnd || !time)
                  ? "red"
                  : theme.colors.outline
            }}
          >
            <View className="flex flex-row items-center justify-center ">
              <DateRangePicker
                initTimeStart={dateStart}
                initTimeEnd={dateEnd}
                setTimeStart={setDateStart}
                setTimeEnd={setDateEnd}
              />
            </View>
            <View className="flex flex-row items-center justify-center">
              <TimePicker time={time} setTime={setTime} />
            </View>
          </View>

          <View className="my-2 flex flex-row items-end justify-between">
            <Text variant={"labelLarge"}>Đơn thuốc</Text>
            <UnderlineButton
              onPress={() => {
                setCurId(maxId.toString());
                setCurMedName("");
                setCurMedAmount("");
                setCurMedPhoto("");
                setAddModalVisible(true);
              }}
            >
              Thêm thuốc
            </UnderlineButton>
          </View>
          {medicineList.length > 0 ? (
            <View>
              <MedicineList items={medicineList} />
            </View>
          ) : (
            <View
              className="rounded-sm border p-4"
              style={{
                backgroundColor: theme.colors.background,
                borderColor:
                  submitError.includes(submitErrorValues.emptyMedList) &&
                  medicineList.length == 0
                    ? "red"
                    : theme.colors.outline
              }}
            >
              <Text className={"text-center leading-6"}>
                Hiện tại chưa có thuốc nào được thêm, nhấn thêm thuốc để thêm.{" "}
              </Text>
            </View>
          )}
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
              submitError.includes(submitErrorValues.emptyNote) && note === ""
                ? {
                    borderColor: "red"
                  }
                : {}
            }
          />

          <View className={"items-center"}>
            <SubmitComponent />
          </View>
        </View>
      </ScrollView>
      <MedicineModal
        title="Thêm thuốc"
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
        }}
        onConfirm={() => {
          addNewMedicine({
            id: curId,
            name: curMedName,
            amount: curMedAmount,
            photo: curMedPhoto,
            onModify: () => {
              setCurId(curId);
              setCurMedName(curMedName);
              setCurMedAmount(curMedAmount);
              setCurMedPhoto(curMedPhoto);
              setModifyModalVisible(true);
            },
            onDelete: () => {
              setCurId(curId);
              setConfirmModalVisible(true);
            }
          });
          setMaxId(maxId + 1);
        }}
        medicineName={curMedName}
        medicineAmount={curMedAmount}
        medicinePhoto={curMedPhoto}
        setMedicineName={setCurMedName}
        setMedicineAmount={setCurMedAmount}
        setMedicinePhoto={setCurMedPhoto}
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
            name: curMedName,
            amount: curMedAmount,
            photo: curMedPhoto,
            onModify: () => {
              setCurId(curId);
              setCurMedName(curMedName);
              setCurMedAmount(curMedAmount);
              setCurMedPhoto(curMedPhoto);
              setModifyModalVisible(true);
            },
            onDelete: () => {
              setCurId(curId);
              setConfirmModalVisible(true);
            }
          });
        }}
        medicineName={curMedName}
        medicineAmount={curMedAmount}
        medicinePhoto={curMedPhoto}
        setMedicineName={setCurMedName}
        setMedicineAmount={setCurMedAmount}
        setMedicinePhoto={setCurMedPhoto}
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
      <AlertComponent />
    </View>
  );
};

export default AddLetter;
