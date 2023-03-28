import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import LeaveLetterHomeView from "../../../src/components/leaveletter/leaveletterHome/LeaveLetterHomeView";
const LeaveLetterHome = () => {
  const [classId, _] = useState<string | undefined>(useSearchParams().classId);

  if (!classId) throw Error("missing params in medicine home screen");
  return (
    <LeaveLetterHomeView classId={classId} studentId={""} isTeacher={true} />
  );
};

export default LeaveLetterHome;
