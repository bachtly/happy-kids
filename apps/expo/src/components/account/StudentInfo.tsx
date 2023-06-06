import { ScrollView, View } from "react-native";
import { useContext, useState } from "react";
import moment from "moment";

import { useAuthContext } from "../../utils/auth-context-provider";
import { api } from "../../utils/api";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import FakeScreenSendWrapper from "../common/FakeScreenSendWrapper";
import { CustomStackFakeWithBack } from "../common/CustomStackFake";
import EditableFormField from "./EditableFormField";
import BirthdateFormField from "./BirthdateFormField";
import BigAvatar from "./BigAvatar";
import { Student, StudentMeta } from "../../models/AccountModels";

interface PropsType {
  studentMeta: StudentMeta;
  visible: boolean;
  setVisible: (v: boolean) => void;
}

const StudentInfo = ({ studentMeta, visible, setVisible }: PropsType) => {
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const [student, setStudent] = useState<Student | null>(null);

  api.account.getStudentInfoParent.useQuery(studentMeta.studentId, {
    onSuccess: (data) => {
      setStudent({
        name: data.fullname,
        avatar: data.avatarUrl,
        birthdate: data.birthdate,
        className: studentMeta.className,
        height: data.height,
        weight: data.weight
      });
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });
  return (
    <FakeScreenSendWrapper
      title=""
      visible={visible}
      onClose={() => setVisible(false)}
      customStackFake={
        <CustomStackFakeWithBack
          title={`Con yêu`}
          onBack={() => setVisible(false)}
        />
      }
    >
      <ScrollView className={"mt-1 px-4"}>
        <View className="my-2">
          <BigAvatar image={student?.avatar ?? ""} />
        </View>
        <EditableFormField
          label="Tên"
          placeholder=""
          setText={(_) => {}}
          text={student?.name ?? ""}
          icon="account-circle"
          textInputProps={{ editable: false }}
        />

        <EditableFormField
          label="Lớp"
          placeholder=""
          setText={(_) => {}}
          text={student?.className ?? ""}
          icon="school"
          textInputProps={{ editable: false }}
        />

        <BirthdateFormField
          date={student?.birthdate ? moment(student.birthdate) : null}
          setDate={(_) => {}}
          disabled={true}
        />

        <EditableFormField
          label="Chiều cao"
          placeholder=""
          setText={(_) => {}}
          text={student?.height ? `${student.height} cm` : ""}
          icon="ruler"
          textInputProps={{ editable: false }}
        />

        <EditableFormField
          label="Cân nặng"
          placeholder=""
          setText={(_) => {}}
          text={student?.weight ? `${student.weight} kg` : ""}
          icon="weight"
          textInputProps={{ editable: false }}
        />
      </ScrollView>
    </FakeScreenSendWrapper>
  );
};

export default StudentInfo;
