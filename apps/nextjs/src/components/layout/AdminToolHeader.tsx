import { signOut } from "next-auth/react";
import { HiEllipsisVertical } from "react-icons/hi2";
import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Button,
  Stack
} from "@chakra-ui/react";
import React from "react";
import { WithCurrentUserInfo } from "~/components/highOrder/WithCurrentUserInfo";
import Link from "next/link";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export interface AdminToolHeaderProps {
  title?: string;
  prevPage?: [string, string];
}

export const AdminToolHeader: React.FC<AdminToolHeaderProps> = ({
  title,
  prevPage
}) => {
  return (
    <div className={"flex h-16 items-center bg-sky-900 px-4 text-white"}>
      {prevPage && (
        <div className={"flex h-full items-center py-4"}>
          <Link href={prevPage[0]} className={"ml-2 flex items-center text-xs"}>
            <ChevronLeftIcon boxSize={8} />
            {prevPage[1]}
          </Link>
          <div className={"mx-4 h-full w-px bg-white"}></div>
        </div>
      )}
      <div className={"text-lg font-semibold"}>{title}</div>
      {
        <div className={"ml-auto"}>
          <WithCurrentUserInfo
            childrenRenderer={(userInfo) => {
              return (
                <Stack spacing={1} className={"mr-2"}>
                  <div className={"font-semibold"}>{userInfo.fullname}</div>
                  <div className={"text-xs"}>{userInfo.email}</div>
                </Stack>
              );
            }}
          />
        </div>
      }
      <Popover placement={"bottom-end"}>
        <PopoverTrigger>
          <div>
            <IconButton
              variant={"ghost"}
              colorScheme={"whiteAlpha"}
              color={"#fff"}
              fontSize={"24px"}
              aria-label="Đăng xuất"
              icon={<HiEllipsisVertical />}
            />
          </div>
        </PopoverTrigger>
        <Portal>
          <PopoverContent w={"auto"}>
            <PopoverArrow />
            <PopoverBody>
              <Button
                variant={"ghost"}
                colorScheme={"red"}
                onClick={() => void signOut()}
              >
                Đăng xuất
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </div>
  );
};

const defaultProps: Partial<AdminToolHeaderProps> = {
  title: "Happy kids Quản lý trường học"
};

AdminToolHeader.defaultProps = defaultProps;
