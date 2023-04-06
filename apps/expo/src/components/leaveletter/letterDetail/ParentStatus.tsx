import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { LeaveLetterStatus } from "../../../models/LeaveLetterModels";
import LetterStatusText from "../../medicine/StatusText";

const ParentStatus = ({
  status,
  updatedByTeacher
}: {
  status: LeaveLetterStatus;
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
