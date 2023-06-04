import React from "react";
import { StudentTable } from "../student/StudentTable";

export interface SchoolStudentManagement {
  schoolId: string;
}

export const SchoolStudentManagement: React.FC<SchoolStudentManagement> = ({
  schoolId
}) => {
  return (
    <div className={"mt-6 px-6 text-sky-950"}>
      <div className={"text-xl font-semibold"}>Lớp học</div>
      <div className={"mt-6"}>
        <StudentTable schoolId={schoolId} />
      </div>
    </div>
  );
};
