import { Stack, useSearchParams } from "expo-router";

import React from "react";
import { View } from "react-native";
import Detail from "../../../src/components/leaveletter/letterDetail/Detail";
import { useAuthContext } from "../../../src/utils/auth-context-provider";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();
  const { userId } = useAuthContext();

  if (!id || !userId || !studentName)
    throw Error("missing params in medicine detail screen");

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "Chi tiết xin nghỉ",
          animation: "slide_from_right"
        }}
      />
      <Detail
        studentName={studentName}
        userId={userId}
        isTeacher={true}
        id={id}
      />
    </View>
  );
};

export default LetterDetail;
