import { Pressable, View } from "react-native";
import React from "react";
import { Text, Avatar, useTheme, Card } from "react-native-paper";
import { useRouter } from "expo-router";

const PostHeader = ({ avatar }: { avatar: string }) => {
  const { colors } = useTheme();

  const router = useRouter();

  return (
    <View>
      <Card
        mode={"elevated"}
        style={{ backgroundColor: colors.background, borderRadius: 2 }}
      >
        <Card.Content style={{ paddingBottom: 0 }}>
          <View className={"flex-row space-x-2 pb-4"}>
            <Avatar.Image
              className={"my-auto"}
              size={42}
              source={{
                uri: `data:image/jpeg;base64,${avatar ?? ""}`
              }}
            />
            <Pressable
              className={"flex-1 justify-center"}
              onPress={() => router.push("teacher/post/text-editor-screen")}
            >
              <View
                className={"border-solid"}
                style={{
                  borderColor: colors.outline,
                  borderWidth: 1,
                  borderRadius: 28,
                  paddingVertical: 8,
                  paddingLeft: 12,
                  backgroundColor: colors.surface
                }}
              >
                <Text
                  style={{ color: colors.onSurface }}
                  variant={"bodyMedium"}
                >
                  Thêm bài viết mới
                </Text>
              </View>
            </Pressable>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default PostHeader;
