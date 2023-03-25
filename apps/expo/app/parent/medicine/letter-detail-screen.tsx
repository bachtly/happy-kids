import { Stack, useSearchParams } from "expo-router";

import React from "react";
import { View } from "react-native";
import Detail from "../../../src/components/medicine/letterDetail/Detail";
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
          title: "Chi tiết dặn thuốc",
          animation: "slide_from_right"
        }}
      />
      <Detail
        studentName={studentName}
        userId={userId}
        isTeacher={false}
        id={id}
      />
    </View>
  );
};

export default LetterDetail;
