import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import MedicineHomeView from "../../../src/components/medicine/medicineHome/MedicineHomeView";

const MedicineHome = () => {
  const [classId, _] = useState<string | undefined>(useSearchParams().classId);

  if (!classId) throw Error("missing params in medicine home screen");
  return <MedicineHomeView classId={classId} studentId="" isTeacher={true} />;
};

export default MedicineHome;
