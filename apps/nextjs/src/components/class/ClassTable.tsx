import React from "react";
import { api } from "~/utils/api";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from "@chakra-ui/react";

export interface ClassTableProps {
  schoolId: string;
}

export const ClassTable: React.FC<ClassTableProps> = ({ schoolId }) => {
  const { data: allClassesInfo } =
    api.school.getAllClassesInfoInSchool.useQuery({
      schoolId: schoolId
    });

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tên lớp</Th>
            <Th>Thời gian tạo</Th>
            <Th isNumeric={true}>Số học sinh</Th>
            <Th isNumeric={true}>Số giáo viên phụ trách</Th>
            <Th isNumeric={true}>Học kỳ</Th>
          </Tr>
        </Thead>
        <Tbody>
          {allClassesInfo?.map((classInfo) => (
            <Tr key={classInfo.classBasicInfo.id}>
              <Td>{classInfo.classBasicInfo.name}</Td>
              <Td>
                {classInfo.classBasicInfo.createdAt.toLocaleDateString("vi-VN")}
              </Td>
              <Td isNumeric={true}>{classInfo.studentCnt}</Td>
              <Td isNumeric={true}>{classInfo.employeeCnt}</Td>
              <Td isNumeric={true}>{classInfo.classBasicInfo.schoolYear}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
