import React from "react";
import AlertModal from "./common/AlertModal";
import type { AlertModalProps } from "./common/AlertModal";

const FormErrorMessage = {
  // leave letter
  leave_letter_missing_date: "Chưa chọn ngày nghỉ",
  leave_letter_empty_reason: "Chưa nhập lý do",

  // medicine letter
  medicine_missing_datetime: "Chưa chọn ngày/giờ uống thuốc",
  medicine_missing_medicine: "Thêm ít nhất 1 thuốc",
  medicine_empty_note: "Chưa nhập ghi chú",

  other: "Đã có lỗi xảy ra, vui lòng thử lại"
};

export type FormError = keyof typeof FormErrorMessage;

const AlertError = (
  props: Omit<AlertModalProps, "message"> & { submitError: FormError[] }
) => {
  return (
    <AlertModal
      message={`Lỗi:\n${props.submitError
        .map((mess) => `\t${FormErrorMessage[mess]}`)
        .join("\n")}`}
      {...props}
    />
  );
};

export default AlertError;
