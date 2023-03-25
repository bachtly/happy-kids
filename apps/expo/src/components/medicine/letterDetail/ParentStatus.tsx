import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import LetterStatusText, {
  IsUsedStatusText,
  LetterStatus
} from "../StatusText";

const ParentStatus = ({
  status,
  isUsed,
  updatedByTeacher
}: {
  status: LetterStatus;
  isUsed: number;
  updatedByTeacher: string | null;
}) => {
  return (
    <View>
      <View className="my-3 flex-row items-center">
        <Text className="font-bold" variant={"bodyMedium"}>
          Trạng thái đơn
        </Text>
        <View className={"flex-grow text-right"}>
          <LetterStatusText status={status} />
        </View>
      </View>
      <View className="mb-3 flex-row items-center">
        <Text className="font-bold" variant={"bodyMedium"}>
          Trạng thái uống thuốc
        </Text>
        <Text className={"flex-grow text-right"} variant={"bodyMedium"}>
          <IsUsedStatusText isUsed={isUsed} />
        </Text>
      </View>
      {updatedByTeacher && (
        <View className="mb-3 flex-row items-center">
          <Text className="font-bold" variant={"bodyMedium"}>
            Cập nhật lần cuối bởi
          </Text>
          <Text className={"flex-grow text-right"} variant={"labelMedium"}>
            {updatedByTeacher}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ParentStatus;
