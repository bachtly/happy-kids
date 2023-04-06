import { Button } from "react-native-paper";

const SubmitComponent = ({
  isSuccess,
  isLoading,
  onSubmit
}: {
  isSuccess: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}) => {
  if (isSuccess)
    return (
      <Button
        className={"mt-5 w-36"}
        mode={"contained"}
        disabled
        icon={"check"}
      >
        Gửi thành công
      </Button>
    );
  if (isLoading)
    return (
      <Button className={"mt-5 w-36"} mode={"contained"} disabled loading>
        Đang gửi
      </Button>
    );
  return (
    <Button
      className={"mt-5 w-36"}
      mode={"contained"}
      onPress={() => {
        onSubmit();
      }}
    >
      Xác nhận
    </Button>
  );
};
export default SubmitComponent;
