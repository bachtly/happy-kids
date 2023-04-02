import React, { FC } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

export type AlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

const AlertModal: FC<AlertModalProps> = (props) => {
  const onClose = () => {
    props.onClose();
  };
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={onClose}>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.Content>
          <Text>{props.message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AlertModal;
