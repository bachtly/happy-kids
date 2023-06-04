import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";
import { Callback } from "../../../../../packages/shared/types";

export interface ModalProps {
  renderTarget: (open: Callback) => React.ReactElement;
  renderContent: (close: Callback) => React.ReactElement;
  title: React.ReactNode;
  size?: string;
}

export const UncontrolledModal: React.FC<ModalProps> = ({
  renderTarget,
  renderContent,
  title,
  size
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {renderTarget(onOpen)}
      <Modal isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          {renderContent(onClose)}
        </ModalContent>
      </Modal>
    </>
  );
};

const defaultProps: Partial<ModalProps> = {
  size: "lg"
};
UncontrolledModal.defaultProps = defaultProps;
