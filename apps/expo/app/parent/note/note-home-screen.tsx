import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import NoteHomeView from "../../../src/components/note/noteHome/NoteHomeView";
const NoteHome = () => {
  const [studentId, _] = useState<string | undefined>(
    useSearchParams().studentId
  );

  if (!studentId) throw Error("missing params in medicine home screen");
  return <NoteHomeView classId={""} studentId={studentId} isTeacher={false} />;
};

export default NoteHome;
