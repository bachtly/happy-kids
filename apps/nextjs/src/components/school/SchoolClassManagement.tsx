import React from "react";
import { ClassTable } from "~/components/class/ClassTable";

export interface SchoolClassManagementProps {
  schoolId: string;
}

export const SchoolClassManagement: React.FC<SchoolClassManagementProps> = ({
  schoolId
}) => {
  return (
    <div className={"mt-6 px-6 text-sky-950"}>
      <div className={"text-xl font-semibold"}>Lớp học</div>
      <div className={"mt-6"}>
        <ClassTable schoolId={schoolId} />
      </div>
    </div>
  );
};
