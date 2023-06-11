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
import type { StudentMeta, ClassStudentMeta } from "../../models/AccountModels";

const ChildrenSwitcher = () => {
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const [sList, setSList] = useState<StudentMeta[]>([]);
  const [sChosen, setSChosen] = useState<StudentMeta>();
  const [cChosen, setCChosen] = useState<ClassStudentMeta>();
  const [visibleChildrenModal, setVisibleChildrenModal] = useState(false);
  const [visibleClassModal, setVisibleClassModal] = useState(false);
  const [visibleI, setVisibleI] = useState(false);

  api.account.getParentChildren.useQuery(undefined, {
    onSuccess: (data) => {
      setSList(
        data.map((item) => ({
          studentId: item.id,
          studentName: item.studentName ?? "",
          avatar: item.avatar,
          school: {
            name: item.schoolName ?? "",
            year: item.schoolYear,
            term: item.schoolTerm
          },
          classes: item.classes
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

  const onChangeStudent = (item: StudentMeta) => {
    authContext.setStudentId(item.studentId);
    setSChosen(item);

    const cS = item.classes.find((classItem) => classItem.isActive);
    authContext.setClassId(cS?.id ?? "");
    setCChosen(cS);
  };

  const onChangeClass = (item: ClassStudentMeta) => {
    authContext.setClassId(item.id);
    setCChosen(item);
  };

  useEffect(() => {
    const sS = sList.find((item) => item.studentId == authContext.studentId);
    setSChosen(sS);
    setCChosen(sS?.classes.find((item) => item.id === authContext.classId));
  }, [sList]);

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
              <TouchableRipple onPress={() => setVisibleChildrenModal(true)}>
                <View className="flex flex-row items-baseline px-1">
                  <Text variant="titleMedium" className="mr-2">
                    {sChosen?.studentName ?? "Student name"}
                  </Text>
                  <FontAwesome5Icon name="chevron-down" />
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => setVisibleClassModal(true)}>
                <View className="flex flex-row items-baseline justify-start px-1">
                  {sChosen && cChosen ? (
                    <Text className="mr-2" variant="bodyMedium">
                      {cChosen.name}
                      {cChosen && cChosen.isActive
                        ? ` (HK${sChosen.school.term ?? "_"} - ${
                            sChosen.school.year ?? "____"
                          })`
                        : " (đã kết thúc)"}
                    </Text>
                  ) : (
                    <Text className="mr-2" variant="bodyMedium">
                      Lớp ___
                    </Text>
                  )}
                  <FontAwesome5Icon name="chevron-down" />
                </View>
              </TouchableRipple>
            </View>
          </View>
        </TouchableRipple>
      </View>
      <ChildrenSwitcherModal
        visible={visibleChildrenModal}
        setVisible={setVisibleChildrenModal}
        sList={sList}
        onChangeStudent={onChangeStudent}
      />
      <ClassSwitcherModal
        visible={visibleClassModal}
        setVisible={setVisibleClassModal}
        cList={sChosen?.classes ?? []}
        onChangeClass={onChangeClass}
      />
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

const ChildrenSwitcherModal = ({
  visible,
  setVisible,
  sList,
  onChangeStudent
}: {
  visible: boolean;
  setVisible: (a: boolean) => void;
  sList: StudentMeta[];
  onChangeStudent: (a: StudentMeta) => void;
}) => {
  const theme = useTheme();
  const authContext = useAuthContext();

  const checkChosenStudent = (item: StudentMeta) =>
    item.studentId === authContext.studentId;

  return (
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
              onChangeStudent(item);
              setVisible(false);
            }}
            {...(checkChosenStudent(item)
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
  );
};

const ClassSwitcherModal = ({
  visible,
  setVisible,
  cList,
  onChangeClass
}: {
  visible: boolean;
  setVisible: (a: boolean) => void;
  cList: ClassStudentMeta[];
  onChangeClass: (a: ClassStudentMeta) => void;
}) => {
  const theme = useTheme();
  const authContext = useAuthContext();

  const checkChosenClass = (item: ClassStudentMeta) =>
    item.id === authContext.classId;
  return (
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
        Các lớp của con
      </Text>

      <View className="space-y-1 rounded-b-md bg-white p-2">
        {cList.map((item) => (
          <Button
            key={item.id}
            mode={"outlined"}
            onPress={() => {
              onChangeClass(item);
              setVisible(false);
            }}
            {...(checkChosenClass(item)
              ? {
                  disabled: true,
                  icon: "check"
                }
              : {})}
          >
            {item.name}
            {` (${item.year}${item.isActive ? " - đang học" : ""})`}
          </Button>
        ))}
      </View>
    </RNModal>
  );
};
