import { Callback } from "../../../../../packages/shared/types";
import React, { useState } from "react";
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  useToast
} from "@chakra-ui/react";
import { SchoolDetailInfo } from "@acme/api/src/router/school/protocols";
import { api } from "~/utils/api";

export interface EditSchoolInfoModalContentProps {
  schoolDetail: SchoolDetailInfo;
  close: Callback;
  onEdit: Callback;
}

export const EditSchoolInfoModalContent: React.FC<
  EditSchoolInfoModalContentProps
> = ({ schoolDetail, close, onEdit }) => {
  const [schoolName, setSchoolName] = useState<string>(schoolDetail.schoolName);
  const [schoolAddress, setSchoolAddress] = useState<string>(
    schoolDetail.schoolAddress ?? ""
  );
  const toast = useToast();
  const onEditSuccessfully = () => {
    toast({
      position: "bottom-left",
      description: "Sửa thông tin trường thành công",
      status: "success"
    });
    onEdit();
    close();
  };
  const editSchoolInfoMutation = api.school.editSchoolInfo.useMutation({
    onSuccess: () => onEditSuccessfully()
  });

  return (
    <>
      <ModalBody>
        <div className={"flex items-center space-x-4"}>
          <div className={"w-1/4"}>Tên trường:</div>

          <Input
            width={"auto"}
            className={"flex-grow"}
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
        </div>
        <div className={"mt-4 flex items-center space-x-4"}>
          <div className={"w-1/4"}>Địa chỉ trường:</div>
          <Input
            width={"auto"}
            className={"flex-grow"}
            value={schoolAddress}
            onChange={(e) => setSchoolAddress(e.target.value)}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => close()} mr={3}>
          Hủy
        </Button>
        <Button
          colorScheme={"blue"}
          onClick={() =>
            editSchoolInfoMutation.mutate({
              schoolId: schoolDetail.schoolId,
              schoolName: schoolName,
              schoolAddress: schoolAddress
            })
          }
        >
          Thay đổi
        </Button>
      </ModalFooter>
    </>
  );
};
