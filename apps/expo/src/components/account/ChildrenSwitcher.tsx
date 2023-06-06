import { View } from "react-native";
import RNModal from "react-native-modal";
import {
  Avatar,
  Text,
  TouchableRipple,
  Button,
  useTheme
} from "react-native-paper";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import { useAuthContext } from "../../utils/auth-context-provider";
import { useContext, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import StudentInfo from "./StudentInfo";

interface Student {
  studentId: string;
  studentName: string;
  avatar: string;
  classId: string;
  className: string;
}
const ChildrenSwitcher = () => {
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const [sList, setSList] = useState<Student[]>([]);
  const [sChosen, setSChosen] = useState<Student>();
  const [visible, setVisible] = useState(false);
  const [visibleI, setVisibleI] = useState(false);
  const theme = useTheme();

  api.account.getParentChildren.useQuery(undefined, {
    onSuccess: (data) => {
      setSList(
        data.map((item) => ({
          studentId: item.studentId,
          studentName: item.studentName ?? "",
          avatar: item.avatar,
          classId: item.classId ?? "",
          className: item.className ?? ""
        }))
      );
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  useEffect(
    () =>
      setSChosen(sList.find((item) => item.studentId == authContext.studentId)),
    [authContext.studentId, sList]
  );

  return (
    <>
      <View className="m-4 mb-0">
        <TouchableRipple onPress={() => setVisibleI(true)}>
          <View className="flex flex-row items-center rounded-md border p-4">
            <Avatar.Image
              source={{
                uri: `data:image/jpeg;base64,${sChosen?.avatar ?? ""}`
              }}
            />
            <View className="ml-2">
              <TouchableRipple onPress={() => setVisible(true)}>
                <View className="flex flex-row items-baseline px-1">
                  <Text variant="titleMedium" className="mr-2">
                    {sChosen?.studentName ?? "Student name"}
                  </Text>
                  <FontAwesome5Icon name="chevron-down" />
                </View>
              </TouchableRipple>
              <Text className="px-1" variant="bodyMedium">
                {sChosen?.className ?? "Class name"}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      </View>
      <RNModal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        useNativeDriver={true}
      >
        <Text
          className="rounded-t-md p-2 text-center text-white"
          variant={"titleMedium"}
          style={{ backgroundColor: theme.colors.primary }}
        >
          Con của bạn
        </Text>
        <View className="space-y-1 rounded-b-md bg-white p-2">
          {sList.map((item) => (
            <Button
              key={item.studentId}
              mode={"outlined"}
              onPress={() => {
                authContext.setStudentId(item.studentId);
                setVisible(false);
              }}
              {...(item.studentId === authContext.studentId
                ? {
                    disabled: true,
                    icon: "check"
                  }
                : {})}
            >
              {item.studentName}
            </Button>
          ))}
        </View>
      </RNModal>
      {sChosen && (
        <StudentInfo
          visible={visibleI}
          setVisible={setVisibleI}
          studentMeta={sChosen}
        />
      )}
    </>
  );
};

export default ChildrenSwitcher;
