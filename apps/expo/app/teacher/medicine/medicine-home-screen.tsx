import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import MedicineHomeView from "../../../src/components/medicine/medicineHome/MedicineHomeView";
import Body from "../../../src/components/Body";
import AlertModal from "../../../src/components/common/AlertModal";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";

const MedicineHome = () => {
  const [classId, _] = useState<string | undefined>(useSearchParams().classId);
  const [errorMessage, setErrorMessage] = useState("");

  if (!classId) setErrorMessage(SYSTEM_ERROR_MESSAGE);
  return (
    <Body>
      <MedicineHomeView classId={classId ?? ""} studentId="" isTeacher={true} />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default MedicineHome;
