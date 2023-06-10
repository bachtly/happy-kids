import { useRouter, useSearchParams } from "expo-router";

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { TextInput } from "react-native-paper";
import { FormError } from "../../../src/components/AlertError";
import LetterSubmitAlert from "../../../src/components/common/LetterSubmitAlert";
import { api } from "../../../src/utils/api";
import moment, { Moment } from "moment";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import Body from "../../../src/components/Body";
import CustomWhiteStackScreen from "../../../src/components/CustomWhiteStackScreen";
import WhiteBody from "../../../src/components/WhiteBody";
import CustomTitle from "../../../src/components/common/CustomTitle";
import LoadingBar from "../../../src/components/common/LoadingBar";

const AddLetter = () => {
  const now = moment();

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
      router.back();
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
      photos: images
    });
  };

  return (
    <Body>
      <CustomWhiteStackScreen
        title={"Tạo lời nhắn"}
        rightButtonHandler={onSubmit}
      />
      <LoadingBar isFetching={postNoteThreadMutation.isLoading} />

      <ScrollView className="flex-1">
        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Lời nhắn cho các ngày"} />

            <View className="flex flex-row items-center justify-center pb-4 pt-1">
              <DateRangePicker
                initTimeStart={dateStart}
                initTimeEnd={dateEnd}
                setTimeStart={setDateStart}
                setTimeEnd={setDateEnd}
              />
            </View>
          </WhiteBody>
        </View>

        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Lời nhắn"} />

            <TextInput
              className={"mx-3 mb-3 text-sm"}
              placeholder="Nhập lời nhắn"
              mode={"outlined"}
              multiline
              onChangeText={(input) => setMessage(input)}
              value={message}
            />
          </WhiteBody>
        </View>

        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Ảnh đính kèm"} />
            <View className={"mx-3 mb-3"}>
              <MultiImagePicker
                onImagesChange={(imgs) => setImages(imgs)}
                images={images}
              />
            </View>
          </WhiteBody>
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
