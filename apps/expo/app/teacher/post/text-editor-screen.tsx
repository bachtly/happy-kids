import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { useTheme, Button, Divider } from "react-native-paper";
import { Stack } from "expo-router";
import MultiImagePicker from "../../../src/components/common/MultiImagePicker";
import "querystring";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { useRouter } from "expo-router";

const TextEditorScreen = () => {
  const { userId } = useAuthContext();
  const router = useRouter();

  const { colors } = useTheme();
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const postMutation = api.post.insertPost.useMutation({});

  const insertPost = (content: string, photos: string[]) => {
    userId &&
      content != "" &&
      postMutation.mutate({
        content: content,
        photos: photos,
        userId: userId
      });
  };

  return (
    <View style={{ padding: 20, backgroundColor: colors.background, flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Thêm bài viết",
          animation: "slide_from_bottom",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onBackground,
          statusBarColor: colors.onSurfaceDisabled
        }}
      />

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

        <MultiImagePicker onImagesChange={(imgs) => setPhotos(imgs)} />
      </View>

      <Button
        onPress={() => {
          insertPost(content, photos);
          router.back();
        }}
        mode={"contained"}
      >
        Đăng
      </Button>
    </View>
  );
};

export default TextEditorScreen;
