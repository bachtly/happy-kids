import { useSearchParams } from "expo-router";
import moment, { Moment } from "moment";

import React, { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import SubmitComponent from "../../../src/components/common/SubmitComponent";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import AlertModal from "../../../src/components/common/AlertModal";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";
import Body from "../../../src/components/Body";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";

const AddLetter = () => {
  const now = moment();
  const theme = useTheme();
  const { studentId } = useSearchParams();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [errorMessage, setErrorMessage] = useState("");

  const [dateStart, setDateStart] = useState<Moment | null>(now);
  const [dateEnd, setDateEnd] = useState<Moment | null>(now);

  const [reason, setReason] = useState("");

  const [images, setImages] = useState<string[]>([]);

  const postLeaveLetterMutation = api.leaveletter.postLeaveLetter.useMutation({
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const onSubmit = () => {
    if (!studentId) {
      setErrorMessage(SYSTEM_ERROR_MESSAGE);
      return;
    }

    if (!dateStart || !dateEnd) {
      setErrorMessage("Vui lòng chọn thời gian xin nghỉ");
      return;
    }

    if (reason === "") {
      setErrorMessage("Vui lòng điền lý do xin nghỉ");
      return;
    }

    dateStart &&
      dateEnd &&
      studentId &&
      postLeaveLetterMutation.mutate({
        studentId: studentId,
        startDate: dateStart.toDate(),
        endDate: dateEnd.toDate(),
        reason: reason,
        photos: images
      });
  };

  return (
    <Body>
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
                errorMessage && (!dateStart || !dateEnd)
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
              errorMessage && reason === "" ? { borderColor: "red" } : {}
            }
          />
          <View className="my-2 flex flex-row items-end justify-between">
            <Text variant={"labelLarge"}>Ảnh đính kèm</Text>
          </View>
          <MultiImagePicker
            onImagesChange={(imgs) => setImages(imgs)}
            images={images}
          />

          <View className={"items-center"}>
            <SubmitComponent
              isLoading={postLeaveLetterMutation.isLoading}
              isSuccess={postLeaveLetterMutation.isSuccess}
              onSubmit={onSubmit}
            />
          </View>
        </View>
      </ScrollView>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default AddLetter;
