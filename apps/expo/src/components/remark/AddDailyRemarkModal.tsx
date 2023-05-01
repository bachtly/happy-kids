import React, { FC, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { api } from "../../utils/api";
import OptionListModal from "../OptionListModal";
import {
  ACTIVITIES,
  ACTIVITIES_VERBOSE_MAP,
  DailyRemarkActivity,
  VERBOSE_ACTIVITIES_MAP
} from "../../models/RemarkModels";
import DropDownButton from "../DropDownButton";
import { DailyRemarkModel } from "../../models/DailyRemarkModels";
import moment from "moment";
import { useAuthContext } from "../../utils/auth-context-provider";
import AlertModal from "../common/AlertModal";

type AddDailyRemarkModalProps = {
  visible: boolean;
  close: () => void;
  submit: () => void;
  remark: DailyRemarkModel;
};

const AddDailyRemarkModal: FC<AddDailyRemarkModalProps> = (props) => {
  const { visible, close, submit, remark } = props;

  const { colors } = useTheme();

  const { userId } = useAuthContext();

  const [activity, setActivity] = useState<DailyRemarkActivity | null>(null);
  const [content, setContent] = useState("");
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const remarkMutation = api.dailyRemark.insertDailyRemarkActivity.useMutation({
    onSuccess: () => {
      submit();
    },
    onError: (e) => setErrorMessage(e.message)
  });

  const insertActivity = () => {
    if (activity === null) {
      setErrorMessage("Vui lòng chọn hoạt động");
      return;
    }

    activity &&
      remarkMutation.mutate({
        activity: activity,
        content: content,
        remarkId: remark.id,
        date: remark.date ?? moment().toDate(),
        studentId: remark.studentId ?? null,
        teacherId: userId
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
            <View className={"mr-2 flex-1"}>
              <DropDownButton
                classNameStr={"text-left"}
                onPress={() => setActivityModalVisible(true)}
              >
                {activity
                  ? ACTIVITIES_VERBOSE_MAP.get(activity)
                  : "Chọn hoạt động"}
              </DropDownButton>
            </View>
            <Button onPress={close}>Hủy</Button>
            <Button onPress={() => insertActivity()}>Lưu</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <OptionListModal
        options={ACTIVITIES.map(
          (act) => ACTIVITIES_VERBOSE_MAP.get(act) ?? "Other"
        )}
        visible={activityModalVisible}
        close={() => setActivityModalVisible(false)}
        submit={(value) => {
          setActivity(
            (VERBOSE_ACTIVITIES_MAP.get(value) ??
              "Other") as DailyRemarkActivity
          );
          setActivityModalVisible(false);
        }}
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default AddDailyRemarkModal;
