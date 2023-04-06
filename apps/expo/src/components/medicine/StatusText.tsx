import { Text } from "react-native-paper";
import {
  MedicineLetterStatus,
  MedicineLetterUseStatus
} from "../../models/MedicineModels";

export default function LetterStatusText({
  status
}: {
  status: MedicineLetterStatus;
}) {
  if (status === "NotConfirmed")
    return (
      <Text variant={"labelMedium"} className={"text-right text-red-500"}>
        Chưa xác nhận
      </Text>
    );
  if (status === "Confirmed")
    return (
      <Text variant={"labelMedium"} className={"text-right text-green-500"}>
        Đã xác nhận
      </Text>
    );

  if (status === "Rejected")
    return (
      <Text variant={"labelMedium"} className={"text-right text-gray-500"}>
        Đã từ chối
      </Text>
    );

  return <Text>{status}</Text>;
}

export function IsUsedStatusText({
  isUsed
}: {
  isUsed: MedicineLetterUseStatus;
}) {
  if (isUsed === "NotUsed")
    return (
      <Text variant={"labelMedium"} className={"text-right text-gray-500"}>
        Không uống
      </Text>
    );
  return (
    <Text variant={"labelMedium"} className={"text-right text-green-500"}>
      Đã uống
    </Text>
  );
}
