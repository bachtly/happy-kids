import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import NoteHomeView from "../../../src/components/note/noteHome/NoteHomeView";
import Body from "../../../src/components/Body";
const NoteHome = () => {
  const [classId, _] = useState<string | undefined>(useSearchParams().classId);

  if (!classId) throw Error("missing params in note home screen");
  return (
    <Body>
      <NoteHomeView classId={classId} studentId={""} isTeacher={true} />
    </Body>
  );
};

export default NoteHome;
