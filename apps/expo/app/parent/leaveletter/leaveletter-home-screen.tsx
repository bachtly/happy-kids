import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import LeaveLetterHomeView from "../../../src/components/leaveletter/leaveletterHome/LeaveLetterHomeView";
import AlertModal from "../../../src/components/common/AlertModal";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";
const LeaveLetterHome = () => {
  const [studentId, _] = useState<string | undefined>(
    useSearchParams().studentId
  );
  const [errorMessage, setErrorMessage] = useState("");

  if (!studentId) setErrorMessage(SYSTEM_ERROR_MESSAGE);

  return (
    <>
      <LeaveLetterHomeView
        classId={""}
        studentId={studentId ?? ""}
        isTeacher={false}
      />
      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default LeaveLetterHome;
