import { useSearchParams } from "expo-router";

import React from "react";
import { View } from "react-native";
import Detail from "../../../src/components/leaveletter/letterDetail/Detail";
import CustomStackScreen from "../../../src/components/CustomStackScreen";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();

  return (
    <View className="flex-1">
      <CustomStackScreen title={"Chi tiết xin nghỉ"} />
      <Detail studentName={studentName} isTeacher={false} id={id} />
    </View>
  );
};

export default LetterDetail;
