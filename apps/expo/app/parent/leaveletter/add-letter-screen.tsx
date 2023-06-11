import { useSearchParams, useRouter } from "expo-router";
import moment, { Moment } from "moment";

import React, { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { TextInput } from "react-native-paper";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";
import Body from "../../../src/components/Body";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import CustomWhiteStackScreen from "../../../src/components/CustomWhiteStackScreen";
import WhiteBody from "../../../src/components/WhiteBody";
import CustomTitle from "../../../src/components/common/CustomTitle";
import LoadingBar from "../../../src/components/common/LoadingBar";
import ShortcutLeaveReason from "../../../src/components/leaveletter/add/ShortcutLeaveReason";

const AddLetter = () => {
  const now = moment();
  const { studentId } = useSearchParams();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

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
      ),
    onSuccess: () => router.back()
  });

  const onSubmit = () => {
    if (!studentId) {
      trpcErrorHandler(() => {})(
        "",
        SYSTEM_ERROR_MESSAGE,
        errorContext,
        authContext
      );
      return;
    }

    if (!dateStart || !dateEnd) {
      trpcErrorHandler(() => {})(
        "",
        "Vui lòng chọn thời gian xin nghỉ",
        errorContext,
        authContext
      );
      return;
    }

    if (reason === "") {
      trpcErrorHandler(() => {})(
        "",
        'Vui lòng điền lý do xin nghỉ. Lý do "Khác" cần điền thêm chi tiết.',
        errorContext,
        authContext
      );
      return;
    }

    dateStart &&
      dateEnd &&
      studentId &&
      authContext.classId &&
      postLeaveLetterMutation.mutate({
        studentId: studentId,
        classId: authContext.classId,
        startDate: dateStart.toDate(),
        endDate: dateEnd.toDate(),
        reason: reason,
        photos: images
      });
  };
  return (
    <Body>
      <CustomWhiteStackScreen
        title={"Tạo đơn xin nghỉ"}
        rightButtonHandler={onSubmit}
      />
      <LoadingBar isFetching={postLeaveLetterMutation.isLoading} />

      <ScrollView className="flex-1">
        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Ngày nghỉ học"} />

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
            <CustomTitle title={"Lý do nghỉ"} />

            <View className={"mx-3 mb-2"}>
              <ShortcutLeaveReason setReason={(inp) => setReason(inp)} />
            </View>

            <TextInput
              className={"mx-3 mb-3 text-sm"}
              placeholder="Nhập lý do nghỉ học"
              mode={"outlined"}
              multiline
              onChangeText={(input) => setReason(input)}
              value={reason}
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
    </Body>
  );
};

export default AddLetter;
