import { AccountInfoModel } from "../../models/AccountModels";
import { api } from "../../utils/api";
import UpdateComponent from "../common/UpdateComponent";
import React, { useContext, useState } from "react";
import AlertModal from "../common/AlertModal";
import { useAuthContext } from "../../utils/auth-context-provider";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";

interface PropsType {
  // userId: string;
  accountInfo: AccountInfoModel;
  fetchData: () => void;
  isAnyChanged: boolean;
  isFetching: boolean;
}

const AccountInfoUpdateComponent = ({
  // userId,
  isAnyChanged,
  isFetching,
  fetchData,
  accountInfo
}: PropsType) => {
  const [errorMessage, setErrorMessage] = useState("");
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const updateMutation = api.account.updateAccountInfo.useMutation({
    onSuccess: (_) => fetchData(),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  return (
    <>
      <UpdateComponent
        disabled={isFetching}
        isAnyChanged={isAnyChanged}
        isUpdating={updateMutation.isLoading}
        onSubmit={() => {
          updateMutation.mutate({
            // userId,
            accountInfo: {
              ...accountInfo,
              birthdate: accountInfo.birthdate?.toDate() ?? null
            }
          });
        }}
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default AccountInfoUpdateComponent;
