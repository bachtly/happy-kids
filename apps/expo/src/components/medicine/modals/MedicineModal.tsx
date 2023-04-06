import React, { FC, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { MedicineModel } from "../../../models/MedicineModels";
import MyImagePicker from "../../ImagePicker";

type MedicineModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  // need for parent's state
  medicine: MedicineModel;
  setMedicine: (medicine: (prev: MedicineModel) => MedicineModel) => void;
};

const MedicineModal: FC<MedicineModalProps> = (props) => {
  const { visible, title, onClose, onConfirm, medicine, setMedicine } = props;

  const [submitFailed, setSubmitFailed] = useState(false);

  const submitMedicine = () => {
    if (!(medicine.name !== "") || !(medicine.amount !== "")) {
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
                onChangeText={(name) =>
                  setMedicine((prev) => ({ ...prev, name: name }))
                }
                value={medicine.name}
                error={submitFailed && medicine.name === ""}
              />
            </View>

            <View className="mb-2">
              <Text variant={"labelLarge"}>Liều dùng</Text>
              <TextInput
                className="text-sm"
                mode="outlined"
                placeholder={"Nhập liều dùng/ hướng dẫn sử dụng của thuốc"}
                multiline
                onChangeText={(amount) =>
                  setMedicine((prev) => ({ ...prev, amount: amount }))
                }
                value={medicine.amount}
                error={submitFailed && medicine.amount === ""}
              />
            </View>

            <View className="mb-2">
              <Text variant={"labelLarge"}>Ảnh thuốc</Text>
              <View className={"mt-2 h-32 w-32"}>
                <MyImagePicker
                  imageData={medicine.photo}
                  setImageData={(photo) =>
                    setMedicine((prev) => ({ ...prev, photo: photo }))
                  }
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
