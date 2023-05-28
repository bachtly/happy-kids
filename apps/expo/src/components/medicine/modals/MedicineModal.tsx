import React, { FC } from "react";
import { ScrollView, View } from "react-native";
import { MedicineModel } from "../../../models/MedicineModels";
import MyImagePicker from "../../ImagePicker";
import CustomTitle from "../../common/CustomTitle";
import FakeScreenSendWrapper from "../../common/FakeScreenSendWrapper";
import CustomTextInput from "../../common/CustomTextInput";

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

  const submitMedicine = () => {
    if (!(medicine.name !== "") || !(medicine.amount !== "")) {
      return;
    }
    onConfirm();
    closeModal();
  };

  const closeModal = () => {
    if (onClose) onClose();
  };

  return (
    <FakeScreenSendWrapper
      visible={visible}
      title={title}
      onClose={closeModal}
      sendButtonHandler={() => submitMedicine()}
    >
      <ScrollView>
        <CustomTitle title={"Tên thuốc"} />

        <View className={"px-3"}>
          <CustomTextInput
            placeholder={"Nhập tên thuốc"}
            value={medicine.name}
            setValue={(name) =>
              setMedicine((prev) => ({ ...prev, name: name }))
            }
          />
        </View>

        <CustomTitle title={"Liều dùng"} />

        <View className={"px-3"}>
          <CustomTextInput
            placeholder={"Nhập liều dùng/ hướng dẫn sử dụng của thuốc"}
            value={medicine.amount}
            setValue={(amount) =>
              setMedicine((prev) => ({ ...prev, amount: amount }))
            }
          />
        </View>

        <CustomTitle title={"Ảnh thuốc"} />

        <View className="px-3">
          <MyImagePicker
            imageData={medicine.photo}
            setImageData={(photo) =>
              setMedicine((prev) => ({ ...prev, photo: photo }))
            }
            size={32}
          />
        </View>
      </ScrollView>
    </FakeScreenSendWrapper>
  );
};

export default MedicineModal;
