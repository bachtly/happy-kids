import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import LetterStatusText from "../../medicine/StatusText";
import { NoteThreadStatus } from "../../../models/NoteModels";

const ParentStatus = ({ status }: { status: NoteThreadStatus }) => {
  return (
    <View>
      <View className="my-3 flex-row items-center">
        <Text variant={"labelLarge"}>Trạng thái đơn</Text>
        <View className={"flex-grow text-right"}>
          <LetterStatusText status={status} />
        </View>
      </View>
    </View>
  );
};

export default ParentStatus;
