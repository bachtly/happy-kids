import React, { FC, useContext, useState } from "react";
import { ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { api } from "../../utils/api";
import moment, { Moment } from "moment";
import { useAuthContext } from "../../utils/auth-context-provider";
import { PeriodRemarkModel } from "../../models/PeriodRemarkModels";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import FakeScreenSendWrapper from "../common/FakeScreenSendWrapper";
import WhiteBody from "../WhiteBody";
import CustomTitle from "../common/CustomTitle";
import Body from "../Body";

type AddDailyRemarkModalProps = {
  visible: boolean;
  close: () => void;
  submit: () => void;
  time: Moment;
  remark: PeriodRemarkModel;
};

const AddPeriodRemarkModal: FC<AddDailyRemarkModalProps> = (props) => {
  const { visible, close, submit, time, remark } = props;

  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [content, setContent] = useState(remark.content ?? "");

  const remarkMutation = api.periodRemark.insertPeriodRemark.useMutation({
    onSuccess: () => {
      submit();
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const insertActivity = () => {
    const date = moment(time.format("MM/DD/YYYY"), "MM/DD/YYYY");
    const startOfMonth = moment(date.toDate().setDate(1));
    const endOfMonth = moment(date.toDate().setDate(1)).add(1, "month");

    remark.studentId &&
      remarkMutation.mutate({
        period: "Month",
        content: content,
        startTime: startOfMonth.toDate(),
        endTime: endOfMonth.toDate(),
        studentId: remark.studentId,
        id: remark.id,
        classId: authContext.classId ?? ""
      });
  };

  return (
    <FakeScreenSendWrapper
      visible={visible}
      title="Thêm nhận xét"
      onClose={() => close()}
      sendButtonHandler={() => insertActivity()}
    >
      <Body>
        <ScrollView className={"flex-1"}>
          <WhiteBody>
            <CustomTitle title={`Nội dung`} />
            <TextInput
              className={"mx-3 mb-3 text-sm"}
              placeholder="Nhập nội dung nhận xét"
              mode={"outlined"}
              multiline
              onChangeText={(input) => setContent(input)}
              value={content}
            />
          </WhiteBody>
        </ScrollView>
      </Body>
    </FakeScreenSendWrapper>
  );
};

export default AddPeriodRemarkModal;
