import React from "react";
import { useTheme } from "react-native-paper";
import RNModal from "react-native-modal";
import CustomStackScreenSend, {
  CustomStackScreenSendFake
} from "../CustomStackScreenSend";

interface PropsType {
  visible: boolean;
  title: string;
  onClose: () => void;
  sendButtonHandler?: () => void;
  children: React.ReactNode;
  customStackFake?: React.ReactNode;
}
const FakeScreenSendWrapper = ({
  visible,
  title,
  sendButtonHandler,
  onClose,
  children,
  customStackFake
}: PropsType) => {
  const { colors } = useTheme();

  return (
    <>
      {visible && <CustomStackScreenSend />}
      <RNModal
        className="m-0"
        isVisible={visible}
        hasBackdrop={false}
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        style={{ backgroundColor: colors.background }}
      >
        {customStackFake ?? (
          <CustomStackScreenSendFake
            title={title}
            sendButtonHandler={sendButtonHandler}
            backButtonHandler={onClose}
          />
        )}
        {children}
      </RNModal>
    </>
  );
};

export default FakeScreenSendWrapper;
