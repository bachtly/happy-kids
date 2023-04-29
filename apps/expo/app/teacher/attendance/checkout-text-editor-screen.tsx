import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { useTheme, Button, Divider } from "react-native-paper";
import { Stack } from "expo-router";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import "querystring";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { useRouter, useSearchParams } from "expo-router";
import AlertModal from "../../../src/components/common/AlertModal";
import moment from "moment";

const CheckinTextEditorScreen = () => {
  const router = useRouter();
  const { userId } = useAuthContext();
  const { colors } = useTheme();
  const { studentId, time } = useSearchParams();

  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const attMutation = api.attendance.checkout.useMutation({
    onSuccess: () => router.back(),
    onError: (e) => setErrorMessage(e.message)
  });

  const checkout = (note: string, photos: string[]) => {
    userId &&
      attMutation.mutate({
        studentId: studentId,
        note: note,
        time: moment(time).toDate(),
        photos: photos,
        teacherId: userId,
        pickerRelativeId: null
      });
  };

  return (
    <View style={{ padding: 20, backgroundColor: colors.background, flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Điểm danh về",
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

        <MultiImagePicker onImagesChange={(imgs) => setPhotos(imgs)} />
      </View>

      <Button
        onPress={() => {
          checkout(note, photos);
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
