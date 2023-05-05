import { useSearchParams } from "expo-router";

import React, { useState } from "react";
import { View } from "react-native";
import Detail from "../../../src/components/leaveletter/letterDetail/Detail";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import AlertModal from "../../../src/components/common/AlertModal";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <View className="flex-1">
      <CustomStackScreen title={"Chi tiết xin nghỉ"} />
      <Detail studentName={studentName} isTeacher={true} id={id} />

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
