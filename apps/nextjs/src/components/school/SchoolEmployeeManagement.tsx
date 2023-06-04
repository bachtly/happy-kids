import React from "react";
import { EmployeeTable } from "../employee/EmployeeTable";

export interface SchoolEmployeeManagementProps {
  schoolId: string;
}
export const SchoolEmployeeManagement: React.FC<
  SchoolEmployeeManagementProps
> = ({ schoolId }) => {
  return (
    <div className={"mt-6 px-6 text-sky-950"}>
      <div className={"text-xl font-semibold"}>Giáo viên</div>
      <div className={"mt-6"}>
        <EmployeeTable schoolId={schoolId} />
      </div>
    </div>
  );
};
