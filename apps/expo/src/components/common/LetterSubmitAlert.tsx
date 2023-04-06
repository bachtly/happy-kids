import AlertError, { FormError } from "../AlertError";
import AlertModal from "./AlertModal";

const LetterSubmitAlert = ({
  visible,
  setVisible,
  submitError,
  afterSubmitSuccess
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  submitError: FormError[];
  afterSubmitSuccess: () => void;
}) => {
  return submitError.length == 0 ? (
    <AlertModal
      title={"Tạo đơn thành công"}
      visible={visible}
      onClose={() => {
        setVisible(false);
        afterSubmitSuccess();
      }}
      message={
        "Bạn đã tạo đơn thành công, vui lòng chờ đơn được giáo viên xử lý"
      }
    />
  ) : (
    <AlertError
      title="Tạo đơn thất bại"
      visible={visible}
      onClose={() => setVisible(false)}
      submitError={submitError}
    />
  );
};

export default LetterSubmitAlert;
