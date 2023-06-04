// only schoolId or classId is defined
import { api } from "~/utils/api";
import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from "@chakra-ui/react";
import { EmployeeRole } from "@acme/api/src/model/user";

export interface EmployeeTableProps {
  schoolId?: string | null;
  classId?: string | null;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  schoolId,
  classId
}) => {
  const { data: teachersInfo } =
    api.school.getTeachersDisplayInfoInSchoolOrClass.useQuery({
      schoolId: schoolId as string | null,
      classId: classId as string | null
    });

  const getDisplayedEmployeeRole = (employeeRole: EmployeeRole | null) => {
    switch (employeeRole) {
      case "Teacher":
        return "Giáo viên";
      case "Manager":
        return "Nhân viên phòng ban quản lý";
      case null:
        return "";
    }
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tên nhân viên</Th>
            <Th>Địa chỉ email</Th>
            <Th>Năm sinh</Th>
            <Th>Chức vụ</Th>
            {schoolId && <Th>Lớp phụ trách</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {teachersInfo?.map((teacherInfo) => (
            <Tr key={teacherInfo.teacher.schoolId}>
              <Td>{teacherInfo.teacher.fullname}</Td>
              <Td>{teacherInfo.teacher.email}</Td>

              <Td>
                {teacherInfo.teacher.birthdate?.toLocaleDateString("vi-VN")}
              </Td>
              <Td>
                {getDisplayedEmployeeRole(teacherInfo.teacher.employeeRole)}
              </Td>
              {schoolId && (
                <Td>
                  {teacherInfo.classes.map((aClass) => aClass.name).join(", ")}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const defaultProps: EmployeeTableProps = {
  schoolId: null,
  classId: null
};

EmployeeTable.defaultProps = defaultProps;
