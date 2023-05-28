import { useSearchParams } from "expo-router";

import { View } from "react-native";
import Detail from "../../../src/components/medicine/letterDetail/Detail";
import { useAuthContext } from "../../../src/utils/auth-context-provider";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();
  const authContext = useAuthContext();
  const { userId } = authContext;

  return (
    <View className="flex-1">
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
