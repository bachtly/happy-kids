import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Image, RefreshControl } from "react-native";
import { RadioButton, Text } from "react-native-paper";
import "querystring";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { useRouter, useSearchParams } from "expo-router";
import {
  AttendanceStatus,
  STATUS_ENUM_TO_VERBOSE
} from "../../../src/models/AttendanceModels";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import CustomWhiteStackScreen from "../../../src/components/CustomWhiteStackScreen";
import CustomTitle from "../../../src/components/common/CustomTitle";
import WhiteBody from "../../../src/components/WhiteBody";
import CustomTextInput from "../../../src/components/common/CustomTextInput";
import thermoIcon from "assets/images/thermometer.png";
import NumericInput from "react-native-numeric-input";
import moment from "moment";
import ImagePicker from "../../../src/components/ImagePicker";

const CheckinTextEditorScreen = () => {
  const router = useRouter();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const { studentId, id, dateStr } = useSearchParams();

  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [status, setStatus] = useState(AttendanceStatus.NotCheckedIn);
  const [thermo, setThermo] = useState(37);
  const date = moment(dateStr);

  const detailMutation = api.attendance.getAttendanceItemDetail.useMutation({
    onSuccess: (resp) => {
      resp.attendance?.checkinNote != null &&
        setNote(resp.attendance.checkinNote);
      resp.attendance?.checkinPhotos != null &&
        setPhotos(resp.attendance.checkinPhotos);
      resp.attendance?.status != null &&
        setStatus(resp.attendance.status as AttendanceStatus);
      resp.attendance?.thermo != null && setThermo(resp.attendance.thermo);
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const attMutation = api.attendance.checkin.useMutation({
    onSuccess: () => router.back(),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const checkin = (
    note: string,
    photos: string[],
    status: AttendanceStatus,
    thermo: number
  ) => {
    attMutation.mutate({
      studentId: studentId,
      status: status,
      note: note,
      photos: photos,
      thermo: thermo,
      date: date.toDate()
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
          title={"Điểm danh đến"}
          rightButtonHandler={() => checkin(note, photos, status, thermo)}
        />

        <CustomTitle title={"Thông tin chung"} />

        <View className={"flex-row justify-between space-x-2 px-3"}>
          <View className={"flex-1 flex-col"} style={{}}>
            <View className={"flex-row"}>
              <RadioButton
                value={status.toString()}
                status={
                  status == "CheckedIn" || status == "CheckedOut"
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => setStatus(AttendanceStatus.CheckedIn)}
              />
              <Text variant={"labelMedium"} className={"my-auto"}>
                {STATUS_ENUM_TO_VERBOSE.get(
                  AttendanceStatus.CheckedIn.toString()
                )}
              </Text>
            </View>

            <View className={"flex-row"}>
              <RadioButton
                value={status.toString()}
                status={
                  status == AttendanceStatus.AbsenseWithPermission.toString()
                    ? "checked"
                    : "unchecked"
                }
                onPress={() =>
                  setStatus(AttendanceStatus.AbsenseWithPermission)
                }
              />
              <Text variant={"labelMedium"} className={"my-auto"}>
                {STATUS_ENUM_TO_VERBOSE.get(
                  AttendanceStatus.AbsenseWithPermission.toString()
                )}
              </Text>
            </View>

            <View className={"flex-row"}>
              <RadioButton
                value={status.toString()}
                status={
                  status == AttendanceStatus.AbsenseWithoutPermission.toString()
                    ? "checked"
                    : "unchecked"
                }
                onPress={() =>
                  setStatus(AttendanceStatus.AbsenseWithoutPermission)
                }
              />
              <Text variant={"labelMedium"} className={"my-auto"}>
                {STATUS_ENUM_TO_VERBOSE.get(
                  AttendanceStatus.AbsenseWithoutPermission.toString()
                )}
              </Text>
            </View>
          </View>

          <View className={"flex-1 flex-row space-x-2 self-center"}>
            <Image className={"aspect-auto h-24 w-16"} source={thermoIcon} />
            <View className={"pt-1"}>
              <NumericInput
                onChange={(value) => setThermo(value)}
                initValue={thermo}
                step={0.5}
                valueType="real"
                totalWidth={80}
                totalHeight={34}
              />
            </View>
          </View>
        </View>

        <CustomTitle title={"Ghi chú"} />

        <View className={"px-3"}>
          <CustomTextInput
            placeholder={"Thêm ghi chú"}
            value={note}
            setValue={setNote}
          />
        </View>

        <CustomTitle title={"Chọn hình ảnh"} />

        <View className={"px-3"}>
          <View className={""}>
            <ImagePicker
              imageData={photos.length > 0 ? photos[0] : ""}
              setImageData={(photo) => setPhotos([photo])}
              size={32}
            />
          </View>
        </View>
      </ScrollView>
    </WhiteBody>
  );
};

export default CheckinTextEditorScreen;
