import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import "querystring";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { useRouter, useSearchParams } from "expo-router";
import moment from "moment";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import { ErrorContext } from "../../../src/utils/error-context";
import CustomWhiteStackScreen from "../../../src/components/CustomWhiteStackScreen";
import WhiteBody from "../../../src/components/WhiteBody";
import CustomTitle from "../../../src/components/common/CustomTitle";
import CustomTextInput from "../../../src/components/common/CustomTextInput";
import ImagePicker from "../../../src/components/ImagePicker";

const CheckinTextEditorScreen = () => {
  const router = useRouter();
  const { id, studentId, time } = useSearchParams();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const detailMutation = api.attendance.getAttendanceItemDetail.useMutation({
    onSuccess: (resp) => {
      resp.attendance?.checkoutNote != null &&
        setNote(resp.attendance.checkoutNote);
      resp.attendance?.checkoutPhotos != null &&
        setPhotos(resp.attendance.checkoutPhotos);
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const attMutation = api.attendance.checkout.useMutation({
    onSuccess: () => router.back(),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const checkout = (note: string, photos: string[]) => {
    attMutation.mutate({
      studentId: studentId,
      note: note,
      time: moment(time).toDate(),
      photos: photos,
      pickerRelativeId: null
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    id &&
      id != "" &&
      detailMutation.mutate({
        id: id
      });
  };

  const isRefreshing = () => attMutation.isLoading || detailMutation.isLoading;

  return (
    <WhiteBody>
      <ScrollView
        className={"flex-1"}
        refreshControl={
          <RefreshControl refreshing={isRefreshing()} onRefresh={refresh} />
        }
      >
        <CustomWhiteStackScreen
          title={"Điểm danh về"}
          addButtonHandler={() => checkout(note, photos)}
        />

        <CustomTitle title={"Ghi chú"} />

        <View className={"px-3"}>
          <CustomTextInput
            placeholder={"Thêm ghi chú"}
            value={note}
            setValue={(text) => setNote(text)}
          />
        </View>

        <CustomTitle title={"Chọn hình ảnh"} />

        <View className={"px-3"}>
          <ImagePicker
            imageData={photos.length > 0 ? photos[0] : ""}
            setImageData={(photo) => setPhotos([photo])}
            size={32}
          />
        </View>
      </ScrollView>
    </WhiteBody>
  );
};

export default CheckinTextEditorScreen;
