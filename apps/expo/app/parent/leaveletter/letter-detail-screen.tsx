import { useSearchParams } from "expo-router";

import React, { useState } from "react";
import { View } from "react-native";
import Detail from "../../../src/components/leaveletter/letterDetail/Detail";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import AlertModal from "../../../src/components/common/AlertModal";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();
  const { userId } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState("");

  if (!id || !userId || !studentName) setErrorMessage(SYSTEM_ERROR_MESSAGE);

  return (
    <View className="flex-1">
      <CustomStackScreen title={"Chi tiết xin nghỉ"} />
      <Detail
        studentName={studentName}
        userId={userId ?? ""}
        isTeacher={false}
        id={id}
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </View>
  );
};

export default LetterDetail;
