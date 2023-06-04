import { AdminToolHeader } from "~/components/layout/AdminToolHeader";
import { Button, Stack } from "@chakra-ui/react";
import { SearchBox } from "~/components/common/SearchBox";
import { useState } from "react";
import { UncontrolledModal } from "~/components/common/UncontrolledModal";
import { CreateSchoolModalBody } from "~/components/indexpage/CreateSchoolModalBody";
import { useRouter } from "next/router";
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
import { SchoolModel } from "@acme/api/src/router/school/protocols";

const SchoolAdminHomePage = () => {
  const [_, setSearchedSchool] = useState<string>("");
  const { data: allSchools } = api.school.getAllSchoolsInfo.useQuery();
  const router = useRouter();
  const onViewSchoolDetail = (schoolItem: SchoolModel) => {
    void router.push(`/school/school-detail/${schoolItem.schoolId}`);
  };
  return (
    <div className={"flex h-screen w-screen flex-col"}>
      <AdminToolHeader />
      <div
        className={"flex-grow px-4 py-4"}
        style={{ backgroundColor: "#f9fcfd" }}
      >
        <div className={"mx-auto flex flex-col"} style={{ maxWidth: "1400px" }}>
          <Stack spacing={4} direction="row" align="center">
            <UncontrolledModal
              title="Tạo một trường học mới"
              renderTarget={(open) => (
                <Button size={"md"} colorScheme={"blue"} onClick={open}>
                  Tạo trường học
                </Button>
              )}
              renderContent={(close) => <CreateSchoolModalBody close={close} />}
              size={"4xl"}
            />
            <SearchBox
              placeholder={"Tìm trường học"}
              onEnter={setSearchedSchool}
              width={"512px"}
            />
          </Stack>
          <TableContainer className={"mt-6"}>
            <Table variant={"simple"} backgroundColor={"white"}>
              <Thead>
                <Tr>
                  <Th>Tên trường</Th>
                  <Th>Địa chỉ trường</Th>
                  <Th>ID</Th>
                  <Th>Thời gian tạo</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allSchools?.map((school) => (
                  <Tr
                    key={school.schoolId}
                    className={"cursor-pointer hover:bg-gray-100"}
                    onClick={() => onViewSchoolDetail(school)}
                  >
                    <Td>{school.schoolName}</Td>
                    <Td>{school.schoolAddress ? school.schoolAddress : ""}</Td>
                    <Td>{school.schoolId}</Td>
                    <Td>{school.createdAt.toLocaleDateString("vi-VN")}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminHomePage;
