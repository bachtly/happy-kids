import React, { useContext, useState } from "react";
import { View, TextInput } from "react-native";
import {
  useTheme,
  Button,
  Divider,
  RadioButton,
  Text
} from "react-native-paper";
import { Stack } from "expo-router";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import "querystring";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { useRouter, useSearchParams } from "expo-router";
import {
  AttendanceStatus,
  STATUS_ENUM_TO_VERBOSE
} from "../../../src/models/AttendanceModels";
import AlertModal from "../../../src/components/common/AlertModal";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";

const CheckinTextEditorScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { studentId } = useSearchParams();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [status, setStatus] = useState(AttendanceStatus.NotCheckedIn);
  const [errorMessage, setErrorMessage] = useState("");

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
    status: AttendanceStatus
  ) => {
    attMutation.mutate({
      studentId: studentId,
      status: status,
      note: note,
      photos: photos
    });
  };

  return (
    <View style={{ padding: 20, backgroundColor: colors.background, flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Điểm danh đến",
          animation: "slide_from_bottom",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onBackground,
          statusBarColor: colors.onSurfaceDisabled
        }}
      />

      <View style={{ marginBottom: 12 }}>
        <TextInput
          placeholder={"Ghi chú cho điểm danh"}
          multiline={true}
          style={{ color: colors.onBackground, maxHeight: 300 }}
          onChangeText={(text) => setNote(text)}
          scrollEnabled={true}
          maxLength={1500}
        />

        <Divider style={{ marginTop: 8, marginBottom: 12 }} />

        <View className={"mb-3 flex-row justify-between"} style={{}}>
          {[
            AttendanceStatus.CheckedIn,
            AttendanceStatus.AbsenseWithPermission,
            AttendanceStatus.AbsenseWithoutPermission
          ].map((itemStatus, key) => (
            <View key={key} className={"flex-row"}>
              <RadioButton
                value={status.toString()}
                status={status == itemStatus ? "checked" : "unchecked"}
                onPress={() => setStatus(itemStatus)}
              />
              <Text className={"m-auto"}>
                {STATUS_ENUM_TO_VERBOSE.get(itemStatus.toString())}
              </Text>
            </View>
          ))}
        </View>

        <MultiImagePicker onImagesChange={(imgs) => setPhotos(imgs)} />
      </View>

      <Button
        onPress={() => {
          checkin(note, photos, status);
        }}
        mode={"contained"}
      >
        Điểm danh ngay
      </Button>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </View>
  );
};

export default CheckinTextEditorScreen;
