import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import {
  MedicineLetterStatus,
  MedicineLetterUseStatus,
  MedUseTime
} from "../../../models/MedicineModels";

type LetterStatusDialogProps = {
  origValue: MedicineLetterStatus;
  setOrigValue: (value: MedicineLetterStatus) => void;
  visible: boolean;
  close: () => void;
};

const LetterStatusDialog = ({
  origValue,
  setOrigValue,
  close,
  visible
}: LetterStatusDialogProps) => {
  const [value, setValue] = useState(origValue);

  const onConfirm = () => {
    setOrigValue(value);
    close();
  };

  const onClose = () => {
    close();
  };

  useEffect(() => {
    setValue(origValue);
  }, [visible]);

  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={visible}>
        <Dialog.Title>Cập nhật trạng thái đơn</Dialog.Title>
        <Dialog.ScrollArea className={"flex flex-row items-center px-3"}>
          <ScrollView>
            <View>
              <RadioButton.Group
                value={value}
                onValueChange={(value: string) =>
                  setValue(value as MedicineLetterStatus)
                }
              >
                <RadioButton.Item value={"Confirmed"} label={"Xác nhận"} />
                <RadioButton.Item value={"Rejected"} label={"Từ chối"} />
              </RadioButton.Group>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onClose}>Hủy</Button>
          <Button onPress={onConfirm}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default LetterStatusDialog;

type IsUsedDialogProps = {
  origValue: MedUseTime;
  setOrigValue: (value: MedicineLetterUseStatus, note: string) => void;
  visible: boolean;
  close: () => void;
};

const IsUsedDialog = ({
  origValue,
  setOrigValue,
  close,
  visible
}: IsUsedDialogProps) => {
  const [value, setValue] = useState(origValue.status);
  const onConfirm = () => {
    setOrigValue(value, origValue.note);
    close();
  };

  const onClose = () => {
    close();
  };

  useEffect(() => {
    setValue(origValue.status);
  }, [visible]);

  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={visible} style={{ maxHeight: 600 }}>
        <Dialog.Title>Trạng thái uống thuốc</Dialog.Title>
        <Dialog.ScrollArea className={"flex flex-row items-center px-3"}>
          <ScrollView className={""}>
            <View className="space-y-0">
              <RadioButton.Group
                value={value}
                onValueChange={(value: string) =>
                  setValue(value as MedicineLetterUseStatus)
                }
              >
                <RadioButton.Item value={"NotUsed"} label={"Không uống"} />
                <RadioButton.Item value={"Used"} label={"Đã uống"} />
              </RadioButton.Group>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onClose}>Hủy</Button>
          <Button onPress={onConfirm}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export { IsUsedDialog };
