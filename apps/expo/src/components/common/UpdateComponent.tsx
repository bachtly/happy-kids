import { Button } from "react-native-paper";

interface UpdateComponentProps {
  isAnyChanged: boolean;
  isUpdating: boolean;
  onSubmit: () => void;
  disabled?: boolean;
}

const UpdateComponent = (props: UpdateComponentProps) => {
  const getText = () => {
    if (!props.isUpdating && !props.isAnyChanged) return "Đã cập nhật";
    if (props.isUpdating) return "Đang cập nhật";
    return "Cập nhật";
  };
  return (
    <Button
      className={"my-3 w-36 self-center"}
      mode={"contained"}
      onPress={props.onSubmit}
      disabled={props.disabled || !props.isAnyChanged || props.isUpdating}
      icon={!props.isAnyChanged ? "check" : undefined}
      loading={props.isUpdating}
    >
      {getText()}
    </Button>
  );
};
export default UpdateComponent;
export type { UpdateComponentProps };
