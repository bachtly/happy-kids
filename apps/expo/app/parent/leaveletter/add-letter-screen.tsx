import { useRouter, useSearchParams } from "expo-router";
import moment, { Moment } from "moment";

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { FormError } from "../../../src/components/AlertError";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import SubmitComponent from "../../../src/components/common/SubmitComponent";
import LetterSubmitAlert from "../../../src/components/common/LetterSubmitAlert";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";

const AddLetter = () => {
  const now = moment();
  const theme = useTheme();
  const { studentId } = useSearchParams();
  const { userId } = useAuthContext();
  if (!userId || !studentId)
    throw Error("missing params in medicine add letter screen");

  const [alertModalVisible, setAlertModalVisible] = useState(false);

  const [dateStart, setDateStart] = useState<Moment | null>(now);
  const [dateEnd, setDateEnd] = useState<Moment | null>(now);

  const [reason, setReason] = useState("");

  const [submitError, setSubmitError] = useState<FormError[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const router = useRouter();
  const postLeaveLetterMutation = api.leaveletter.postLeaveLetter.useMutation({
    onSuccess: (data) => {
      if (data.leaveLetterId === "") {
        console.log(data.message);
        setSubmitError(["other"]);
      }
      setAlertModalVisible(true);
    }
  });

  const onSubmit = () => {
    setSubmitError([]);
    if (!dateStart || !dateEnd || reason === "") {
      if (reason === "")
        setSubmitError((prev) => [...prev, "leave_letter_empty_reason"]);

      setAlertModalVisible(true);
      return;
    }
    postLeaveLetterMutation.mutate({
      parentId: userId,
      studentId: studentId,
      startDate: dateStart.toDate(),
      endDate: dateEnd.toDate(),
      reason: reason,
      photos: images.filter((item) => item !== "")
    });
  };

  return (
    <View className="flex-1">
      <CustomStackScreen title={"Tạo đơn xin nghỉ"} />

      <ScrollView className="flex-1">
        <View className="flex-1  p-4">
          <Text className="mb-2" variant={"labelLarge"}>
            Ngày nghỉ học
          </Text>

          <View
            className="space-y-2 rounded-sm border p-4"
            style={{
              backgroundColor: theme.colors.background,
              borderColor:
                submitError.includes("leave_letter_missing_date") &&
                (!dateStart || !dateEnd)
                  ? "red"
                  : theme.colors.outline
            }}
          >
            <View className="flex flex-row items-center justify-center ">
              <DateRangePicker
                initTimeStart={dateStart}
                initTimeEnd={dateEnd}
                setTimeStart={setDateStart}
                setTimeEnd={setDateEnd}
              />
            </View>
          </View>

          <Text variant={"labelLarge"} className={"mt-2"}>
            Lý do nghỉ
          </Text>

          <TextInput
            className={"text-sm"}
            placeholder="Nhập lý do nghỉ học"
            mode={"outlined"}
            multiline
            onChangeText={(input) => setReason(input)}
            value={reason}
            outlineStyle={
              submitError.includes("leave_letter_empty_reason") && reason === ""
                ? {
                    borderColor: "red"
                  }
                : {}
            }
          />
          <View className="my-2 flex flex-row items-end justify-between">
            <Text variant={"labelLarge"}>Ảnh đính kèm</Text>
          </View>
          <MultiImagePicker onImagesChange={(imgs) => setImages(imgs)} />

          <View className={"items-center"}>
            <SubmitComponent
              isLoading={postLeaveLetterMutation.isLoading}
              isSuccess={
                postLeaveLetterMutation.isSuccess && submitError.length == 0
              }
              onSubmit={onSubmit}
            />
          </View>
        </View>
      </ScrollView>

      <LetterSubmitAlert
        visible={alertModalVisible}
        setVisible={setAlertModalVisible}
        submitError={submitError}
        afterSubmitSuccess={() => router.back()}
      />
    </View>
  );
};

export default AddLetter;
