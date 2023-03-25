import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { LetterStatus } from "../StatusText";

type LetterStatusDialogProps = {
  origValue: LetterStatus;
  setOrigValue: (value: LetterStatus) => void;
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
        <Dialog.ScrollArea className={"flex flex-row items-center px-0"}>
          <ScrollView>
            <View>
              <RadioButton.Group
                value={value}
                onValueChange={(value: string) =>
                  setValue(value as LetterStatus)
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
  origValue: number;
  setOrigValue: (value: number) => void;
  visible: boolean;
  close: () => void;
};

const IsUsedDialog = ({
  origValue,
  setOrigValue,
  close,
  visible
}: IsUsedDialogProps) => {
  const [value, setValue] = useState(origValue.toString());

  const onConfirm = () => {
    setOrigValue(parseInt(value));
    close();
  };

  const onClose = () => {
    close();
  };

  useEffect(() => {
    setValue(origValue.toString());
  }, [visible]);

  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={visible}>
        <Dialog.Title>Cập nhật trạng thái uống thuốc</Dialog.Title>
        <Dialog.ScrollArea className={"flex flex-row items-center px-0"}>
          <ScrollView>
            <View>
              <RadioButton.Group
                value={value}
                onValueChange={(value: string) => setValue(value)}
              >
                <RadioButton.Item value={"0"} label={"Chưa uống"} />
                <RadioButton.Item value={"1"} label={"Đã uống"} />
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
