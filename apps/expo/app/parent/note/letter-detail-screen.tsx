import { useSearchParams } from "expo-router";

import React from "react";
import { View } from "react-native";
import Detail from "../../../src/components/note/letterDetail/Detail";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();
  const { userId } = useAuthContext();

  if (!id || !userId || !studentName)
    throw Error("missing params in note detail screen");

  return (
    <View className="flex-1">
      <CustomStackScreen title={"Chi tiết lời nhắn"} />
      <Detail userId={userId} id={id} isTeacher={false} />
    </View>
  );
};

export default LetterDetail;
