import React, { FC, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import MyImagePicker from "../../ImagePicker";

type MedicineModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  // need for parent's state
  medicineName: string;
  medicineAmount: string;
  medicinePhoto: string;
  setMedicineName: (name: string) => void;
  setMedicineAmount: (amount: string) => void;
  setMedicinePhoto: (photo: string) => void;
};

const MedicineModal: FC<MedicineModalProps> = (props) => {
  const {
    visible,
    title,
    onClose,
    onConfirm,
    medicineName,
    medicineAmount,
    medicinePhoto,
    setMedicineName,
    setMedicineAmount,
    setMedicinePhoto
  } = props;

  const [submitFailed, setSubmitFailed] = useState(false);

  const submitMedicine = () => {
    if (!(medicineName !== "") || !(medicineAmount !== "")) {
      setSubmitFailed(true);
      return;
    }
    onConfirm();
    closeModal();
  };

  const closeModal = () => {
    setSubmitFailed(false);
    if (onClose) onClose();
  };

  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} style={{ maxHeight: 600 }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea className={"px-0"}>
          <ScrollView className={"px-6 pt-1"}>
            <View className="mb-2">
              <Text variant={"labelLarge"}>Tên thuốc</Text>
              <TextInput
                className={"text-sm"}
                mode="outlined"
                placeholder={"Nhập tên thuốc"}
                onChangeText={setMedicineName}
                value={medicineName}
                error={submitFailed && medicineName === ""}
              />
            </View>

            <View className="mb-2">
              <Text variant={"labelLarge"}>Liều dùng</Text>
              <TextInput
                className="text-sm"
                mode="outlined"
                placeholder={"Nhập liều dùng/ hướng dẫn sử dụng của thuốc"}
                multiline
                onChangeText={setMedicineAmount}
                value={medicineAmount}
                error={submitFailed && medicineAmount === ""}
              />
            </View>

            <View className="mb-2">
              <Text variant={"labelLarge"}>Ảnh thuốc</Text>
              <View className={"mt-2 h-32 w-32"}>
                <MyImagePicker
                  imageData={medicinePhoto}
                  setImageData={setMedicinePhoto}
                />
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={closeModal}>Hủy</Button>
          <Button onPress={submitMedicine}>Lưu</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default MedicineModal;
