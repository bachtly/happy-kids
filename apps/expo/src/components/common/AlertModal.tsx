import React, { FC } from "react";
import { Button, Dialog, Text } from "react-native-paper";
import { Modal } from "react-native";

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
    <Modal visible={props.visible} transparent={true}>
      <Dialog visible={true} onDismiss={onClose}>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.Content>
          <Text>{props.message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Modal>
  );
};

export default AlertModal;
