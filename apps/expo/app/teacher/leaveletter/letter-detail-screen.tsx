import { useSearchParams } from "expo-router";

import { View } from "react-native";
import Detail from "../../../src/components/leaveletter/letterDetail/Detail";

const LetterDetail = () => {
  const { id, studentName } = useSearchParams();

  return (
    <View className="flex-1">
      <Detail studentName={studentName} isTeacher={true} id={id} />
    </View>
  );
};

export default LetterDetail;
