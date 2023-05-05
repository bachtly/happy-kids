import React, { FC, useContext, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { api } from "../../utils/api";
import moment, { Moment } from "moment";
import { useAuthContext } from "../../utils/auth-context-provider";
import { PeriodRemarkModel } from "../../models/PeriodRemarkModels";
import AlertModal from "../common/AlertModal";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";

type AddDailyRemarkModalProps = {
  visible: boolean;
  close: () => void;
  submit: () => void;
  time: Moment;
  remark: PeriodRemarkModel;
};

const AddPeriodRemarkModal: FC<AddDailyRemarkModalProps> = (props) => {
  const { visible, close, submit, time, remark } = props;

  const { colors } = useTheme();

  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        studentId: remark.studentId
      });
  };

  return (
    <>
      <Portal>
        <Dialog
          visible={visible}
          dismissable={false}
          style={{ maxHeight: 400 }}
        >
          <Dialog.Title>Thêm nhận xét</Dialog.Title>
          <Dialog.ScrollArea className={"px-6 py-2"}>
            <ScrollView style={{ height: 200 }}>
              <TextInput
                placeholder={"Nhập nội dung nhận xét"}
                multiline={true}
                style={{ color: colors.onBackground }}
                onChangeText={(text) => setContent(text)}
              />
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={close}>Hủy</Button>
            <Button onPress={() => insertActivity()}>Lưu</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default AddPeriodRemarkModal;
