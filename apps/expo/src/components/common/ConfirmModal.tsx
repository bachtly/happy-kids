import React, { FC } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const onConfirm = () => {
    props.onConfirm();
    onClose();
  };
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
          <Button onPress={onClose}>Hủy</Button>
          <Button onPress={onConfirm}>Xác nhận</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
