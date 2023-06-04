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
  TableContainer,
  Spinner
} from "@chakra-ui/react";
import { ClassModel } from "@acme/api/src/model/class";
import { StudentWithParentInfo } from "@acme/api/src/router/student/protocols";

export interface StudentTableProps {
  schoolId?: string | null;
  classId?: string | null;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  schoolId,
  classId
}) => {
  const { data: classesInfo } =
    api.school.getStudentInfosInSchoolOrClass.useQuery({
      schoolId: schoolId as string | null,
      classId: classId as string | null
    });

  if (!classesInfo) {
    return <Spinner />;
  }

  const studentModelMap: Map<string, StudentWithParentInfo> = new Map(
    classesInfo.flatMap((classInfo) => {
      return classInfo.students.map((student) => [student.studentId, student]);
    })
  );
  const studentsAndClasses: Map<string, ClassModel> = new Map();
  classesInfo.map((classInfo) =>
    classInfo.students.map((student) => {
      const latestClass = studentsAndClasses.get(student.studentId);
      if (
        !latestClass ||
        latestClass.schoolYear < classInfo.classModel.schoolYear
      ) {
        studentsAndClasses.set(student.studentId, classInfo.classModel);
      }
    })
  );

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tên học sinh</Th>
            <Th>Năm sinh</Th>
            <Th>Tên phụ huynh</Th>
            {schoolId && <Th>Lớp học</Th>}
            {schoolId && <Th isNumeric={true}>Năm học</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {Array.from(studentsAndClasses.entries()).map(
            ([studentId, latestClass]) => {
              const studentModel = studentModelMap.get(
                studentId
              ) as StudentWithParentInfo;
              return (
                <Tr key={studentModel.studentId}>
                  <Td>{studentModel.fullname}</Td>
                  <Td>{studentModel.birthdate?.toLocaleDateString("vi-VN")}</Td>
                  <Td>{studentModel.parentInfo.fullname}</Td>
                  {schoolId && <Td>{latestClass.name}</Td>}
                  {schoolId && (
                    <Td isNumeric={true}>{latestClass.schoolYear}</Td>
                  )}
                </Tr>
              );
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const defaultProps: StudentTableProps = {
  schoolId: null,
  classId: null
};

StudentTable.defaultProps = defaultProps;
