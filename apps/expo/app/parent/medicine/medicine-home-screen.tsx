import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import MedicineHomeView from "../../../src/components/medicine/medicineHome/MedicineHomeView";

const MedicineHome = () => {
  const [studentId, _] = useState<string | undefined>(
    useSearchParams().studentId
  );

  if (!studentId) throw Error("missing params in medicine home screen");
  return (
    <MedicineHomeView classId={""} studentId={studentId} isTeacher={false} />
  );
};

export default MedicineHome;
