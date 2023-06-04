import { Button, Input, ModalBody, ModalFooter } from "@chakra-ui/react";
import { Callback } from "../../../../../packages/shared/types";
import React, { useState } from "react";
import { api } from "~/utils/api";

export interface CreateSchoolModalBodyProps {
  close: Callback;
}
export const CreateSchoolModalBody: React.FC<CreateSchoolModalBodyProps> = ({
  close
}) => {
  const createSchoolMutation = api.school.createSchool.useMutation();
  const [schoolName, setSchoolName] = useState<string>("");
  const [principalEmail, setPrincipalEmail] = useState<string>("");
  const onCreateSchool = () => {
    createSchoolMutation.mutate({
      schoolName: schoolName,
      schoolPrincipal: { emailAddress: principalEmail }
    });
  };
  return (
    <>
      <ModalBody>
        <div className={"flex items-center"}>
          <div className={"w-1/5"}>Tên trường</div>
          <Input
            placeholder={"Nhập tên trường"}
            onChange={(event) => setSchoolName(event.target.value)}
          />
        </div>
        <div className={"mt-4 flex items-center"}>
          <div className={"w-1/5"}>Hiệu trưởng</div>
          <div className={"flex w-full space-x-2"}>
            <Input
              placeholder={"Email"}
              value={principalEmail}
              onChange={(event) => setPrincipalEmail(event.target.value)}
            />
            <Input placeholder={"Họ"} />
            <Input placeholder={"Tên"} />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={close} mr={3}>
          Hủy
        </Button>
        <Button colorScheme={"blue"} onClick={() => onCreateSchool()}>
          Tạo
        </Button>
      </ModalFooter>
    </>
  );
};
