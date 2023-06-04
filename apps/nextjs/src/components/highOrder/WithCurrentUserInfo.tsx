import { api } from "~/utils/api";
import React from "react";
import { Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { UserInfo } from "@acme/api/src/model/user";

export interface WithCurrentUserInfoProps {
  childrenRenderer: (userInfo: UserInfo) => React.ReactElement;
}
export const WithCurrentUserInfo = ({
  childrenRenderer
}: WithCurrentUserInfoProps): React.ReactElement => {
  const { data: session } = useSession();
  const spinner = (
    <div className={"flex justify-center "}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </div>
  );
  const { data: userInfo } = api.user.userInfo.useQuery(
    {
      userId: session?.user.id as string
    },
    { enabled: !!session?.user.id }
  );
  if (!userInfo) {
    return spinner;
  } else {
    return childrenRenderer(userInfo);
  }
};
