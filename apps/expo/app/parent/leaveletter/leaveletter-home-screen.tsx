import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import LeaveLetterHomeView from "../../../src/components/leaveletter/leaveletterHome/LeaveLetterHomeView";
const LeaveLetterHome = () => {
  const [studentId, _] = useState<string | undefined>(
    useSearchParams().studentId
  );

  if (!studentId) throw Error("missing params in medicine home screen");
  return (
    <LeaveLetterHomeView classId={""} studentId={studentId} isTeacher={false} />
  );
};

export default LeaveLetterHome;
