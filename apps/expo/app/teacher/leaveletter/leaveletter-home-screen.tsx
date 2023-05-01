import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import LeaveLetterHomeView from "../../../src/components/leaveletter/leaveletterHome/LeaveLetterHomeView";
import Body from "../../../src/components/Body";
import AlertModal from "../../../src/components/common/AlertModal";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";
const LeaveLetterHome = () => {
  const [classId, _] = useState<string | undefined>(useSearchParams().classId);
  const [errorMessage, setErrorMessage] = useState("");

  if (!classId) setErrorMessage(SYSTEM_ERROR_MESSAGE);

  return (
    <Body>
      <LeaveLetterHomeView
        classId={classId ?? ""}
        studentId={""}
        isTeacher={true}
      />
      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default LeaveLetterHome;
