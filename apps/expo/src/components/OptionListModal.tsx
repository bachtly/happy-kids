import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";

type OptionListDialogProps = {
  options: string[];
  visible: boolean;
  close: () => void;
  submit: (option: string) => void;
};

const OptionListModal = ({
  options,
  visible,
  close,
  submit
}: OptionListDialogProps) => {
  const [value, setValue] = useState(options[0]);

  return (
    <Portal>
      <Dialog dismissable={false} visible={visible}>
        <Dialog.Title>Cập nhật trạng thái đơn</Dialog.Title>
        <Dialog.ScrollArea className={"flex flex-row items-center px-0"}>
          <ScrollView>
            <View>
              <RadioButton.Group
                value={value}
                onValueChange={(value: string) => setValue(value)}
              >
                {options.map((item, key) => (
                  <RadioButton.Item key={key} value={item} label={item} />
                ))}
              </RadioButton.Group>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => close()}>Hủy</Button>
          <Button onPress={() => submit(value)}>Lưu</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default OptionListModal;
