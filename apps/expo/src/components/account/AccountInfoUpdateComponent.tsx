import { AccountInfoModel } from "../../models/AccountModels";
import { api } from "../../utils/api";
import UpdateComponent from "../common/UpdateComponent";

interface PropsType {
  userId: string;
  accountInfo: AccountInfoModel;
  fetchData: () => void;
  isAnyChanged: boolean;
  isFetching: boolean;
}

const AccountInfoUpdateComponent = ({
  userId,
  isAnyChanged,
  isFetching,
  fetchData,
  accountInfo
}: PropsType) => {
  const updateMutation = api.account.updateAccountInfo.useMutation({
    onSuccess: (data) => {
      if (data.errMess !== "") {
        console.log(data.errMess);
      } else {
        fetchData();
      }
    }
  });

  return (
    <UpdateComponent
      disabled={isFetching}
      isAnyChanged={isAnyChanged}
      isUpdating={updateMutation.isLoading}
      onSubmit={() => {
        updateMutation.mutate({
          userId,
          accountInfo: {
            ...accountInfo,
            birthdate: accountInfo.birthdate?.toDate() ?? null
          }
        });
      }}
    />
  );
};

export default AccountInfoUpdateComponent;
