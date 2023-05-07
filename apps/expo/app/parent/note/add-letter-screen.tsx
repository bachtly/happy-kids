import { useRouter, useSearchParams } from "expo-router";

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { FormError } from "../../../src/components/AlertError";
import CustomStackScreen from "../../../src/components/CustomStackScreen";
import SubmitComponent from "../../../src/components/common/SubmitComponent";
import LetterSubmitAlert from "../../../src/components/common/LetterSubmitAlert";
import { api } from "../../../src/utils/api";
import moment, { Moment } from "moment";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import Body from "../../../src/components/Body";

const AddLetter = () => {
  const now = moment();
  const theme = useTheme();

  const { studentId } = useSearchParams();

  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [dateStart, setDateStart] = useState<Moment | null>(now);
  const [dateEnd, setDateEnd] = useState<Moment | null>(now);
  const [images, setImages] = useState<string[]>([]);

  const [submitError, setSubmitError] = useState<FormError[]>([]);

  const router = useRouter();
  const postNoteThreadMutation = api.note.postNoteThread.useMutation({
    onSuccess: (data) => {
      if (data.noteThreadId === "") {
        setSubmitError(["other"]);
      }
      setAlertModalVisible(true);
    }
  });

  const onSubmit = () => {
    setSubmitError([]);
    if (!dateStart || !dateEnd || message === "") {
      if (message === "")
        setSubmitError((prev) => [...prev, "note_empty_note"]);

      setAlertModalVisible(true);
      return;
    }
    postNoteThreadMutation.mutate({
      content: message,
      startDate: dateStart.toDate(),
      endDate: dateEnd.toDate(),
      studentId: studentId,
      photos: images.filter((item) => item !== "")
    });
  };

  return (
    <Body>
      <CustomStackScreen title={"Tạo lời nhắn"} />

      <ScrollView className="flex-1">
        <View className="flex-1  p-4">
          <Text className="mb-2" variant={"labelLarge"}>
            Lời nhắn cho các ngày
          </Text>

          <View
            className="space-y-2 rounded-sm border p-4"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.outline
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
            Lời nhắn
          </Text>

          <TextInput
            className={"text-sm"}
            placeholder="Nhập lời nhắn"
            mode={"outlined"}
            multiline
            onChangeText={(input) => setMessage(input)}
            value={message}
            outlineStyle={
              submitError.includes("leave_letter_empty_reason") &&
              message === ""
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
              isLoading={postNoteThreadMutation.isLoading}
              isSuccess={
                postNoteThreadMutation.isSuccess && submitError.length === 0
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
    </Body>
  );
};

export default AddLetter;
