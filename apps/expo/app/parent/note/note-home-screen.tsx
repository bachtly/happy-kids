import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import NoteHomeView from "../../../src/components/note/noteHome/NoteHomeView";
import Body from "../../../src/components/Body";
const NoteHome = () => {
  const [studentId, _] = useState<string | undefined>(
    useSearchParams().studentId
  );
  const [classId, __] = useState<string | undefined>(useSearchParams().classId);

  if (!studentId) throw Error("missing params in medicine home screen");
  return (
    <Body>
      <NoteHomeView
        classId={classId ?? ""}
        studentId={studentId}
        isTeacher={false}
      />
    </Body>
  );
};

export default NoteHome;
