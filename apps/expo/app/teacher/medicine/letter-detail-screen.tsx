import { useSearchParams } from "expo-router";

import React from "react";
import { View } from "react-native";
import Detail from "../../../src/components/medicine/letterDetail/Detail";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();
  const { userId } = useAuthContext();

  return (
    <View className="flex-1">
      <CustomStackScreen title={"Chi tiết dặn thuốc"} />

      <Detail
        studentName={studentName}
        userId={userId ?? ""}
        isTeacher={true}
        id={id}
      />
    </View>
  );
};

export default LetterDetail;
