import React, { useState } from "react";
import NoteHomeView from "../../../src/components/note/noteHome/NoteHomeView";
import Body from "../../../src/components/Body";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
const NoteHome = () => {
  const [classId, _] = useState<string>(useAuthContext().classId ?? "");

  return (
    <Body>
      <NoteHomeView classId={classId} studentId={""} isTeacher={true} />
    </Body>
  );
};

export default NoteHome;
