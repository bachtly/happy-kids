import React, { useContext, useState } from "react";
import { View, TextInput } from "react-native";
import { useTheme, Button, Divider } from "react-native-paper";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { useRouter } from "expo-router";
import AlertModal from "../../../src/components/common/AlertModal";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import CustomWhiteStackScreen from "../../../src/components/CustomWhiteStackScreen";

const TextEditorScreen = () => {
  const router = useRouter();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const { colors } = useTheme();
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const postMutation = api.post.insertPost.useMutation({
    onSuccess: () => router.back(),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const insertPost = (content: string, photos: string[]) => {
    postMutation.mutate({
      content: content,
      photos: photos
    });
  };

  return (
    <View style={{ padding: 20, backgroundColor: colors.background, flex: 1 }}>
      <CustomWhiteStackScreen title={"Thêm bài viết"} />

      <View style={{ marginBottom: 12 }}>
        <TextInput
          placeholder={"Nhập nội dung bài viết"}
          multiline={true}
          style={{ color: colors.onBackground, maxHeight: 300 }}
          onChangeText={(text) => setContent(text)}
          scrollEnabled={true}
          maxLength={1500}
        />

        <Divider style={{ marginTop: 8, marginBottom: 12 }} />

        <MultiImagePicker
          onImagesChange={(imgs) => setPhotos(imgs)}
          images={photos}
        />
      </View>

      <Button
        onPress={() => {
          insertPost(content, photos);
        }}
        mode={"contained"}
      >
        Đăng
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

export default TextEditorScreen;
