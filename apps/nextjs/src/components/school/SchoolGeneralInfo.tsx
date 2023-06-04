import {
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr
} from "@chakra-ui/react";
import React from "react";
import { UncontrolledModal } from "~/components/common/UncontrolledModal";
import { EditSchoolInfoModalContent } from "~/components/school/EditSchoolInfoModalContent";
import { SchoolDetailInfo } from "@acme/api/src/router/school/protocols";
import { Callback } from "../../../../../packages/shared/types";

export interface SchoolGeneralInfoProps {
  schoolDetail: SchoolDetailInfo;
  refetch: Callback;
}

export const SchoolGeneralInfo: React.FC<SchoolGeneralInfoProps> = ({
  schoolDetail,
  refetch
}) => {
  return schoolDetail ? (
    <div className={"mt-6 px-6 text-sky-950"}>
      <div className={"text-xl font-semibold"}>Thông tin chung</div>
      <div className={"mt-4"}>
        <TableContainer>
          <Table variant="simple" colorScheme={"gray"}>
            <Tbody>
              <Tr>
                <Td>Tên trường</Td>
                <Td>{schoolDetail.schoolName}</Td>
              </Tr>
              <Tr>
                <Td>Địa chỉ</Td>
                <Td>{schoolDetail.schoolAddress}</Td>
              </Tr>
              <Tr>
                <Td>Ngày tạo</Td>
                <Td>{schoolDetail.createdTime.toLocaleDateString("vi-VN")}</Td>
              </Tr>
              <Tr>
                <Td>Số cán bộ trong trường</Td>
                <Td>{schoolDetail.activeTeachersCount}</Td>
              </Tr>
              <Tr>
                <Td>Số lớp học trong học kỳ hiện tại</Td>
                <Td>{schoolDetail.activeClassCount}</Td>
              </Tr>
              <Tr>
                <Td>Tổng số lớp học đã trải qua</Td>
                <Td>{schoolDetail.grandTotalClassCount}</Td>
              </Tr>
              <Tr>
                <Td>Số học sinh trong học kỳ hiện tại</Td>
                <Td>{schoolDetail.activeStudentCount}</Td>
              </Tr>
              <Tr>
                <Td>Tổng số học sinh đã từng theo học</Td>
                <Td>{schoolDetail.grandTotalStudentCount}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <div className={"ml-6 mt-4"}>
          <UncontrolledModal
            size={"xl"}
            renderTarget={(open) => (
              <Button colorScheme={"blue"} onClick={() => open()}>
                Sửa thông tin
              </Button>
            )}
            renderContent={(close) => (
              <EditSchoolInfoModalContent
                schoolDetail={schoolDetail}
                close={close}
                onEdit={() => refetch()}
              />
            )}
            title={"Sửa thông tin của trường"}
          />
        </div>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};
