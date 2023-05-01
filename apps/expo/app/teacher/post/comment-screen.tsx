import { FlatList, TextInput, View } from "react-native";
import { useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { CommentModel } from "../../../src/models/PostModels";
import { api } from "../../../src/utils/api";
import CommentItem from "../../../src/components/post/CommentItem";
import { useSearchParams } from "expo-router";
import { Stack } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import AlertModal from "../../../src/components/common/AlertModal";

const ITEM_PER_PAGE = 6;

const CommentScreen = () => {
  const { postId } = useSearchParams();
  const { userId } = useAuthContext();
  const { colors } = useTheme();

  const [comments, setComments] = useState<CommentModel[]>([]);
  const [content, setContent] = useState("");
  const [page, setPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const postMutation = api.post.getCommentList.useMutation({
    onSuccess: (resp) => {
      const tmp = comments;
      setComments(
        tmp.concat(
          resp.comments.filter(
            (item) => tmp.filter((item2) => item2.id == item.id).length == 0
          )
        )
      );

      if (!resp.hasNextPage) {
        setPage(-1);
      } else {
        const tmp = page;
        setPage(tmp + 1);
      }
    },
    onError: (e) => setErrorMessage(e.message)
  });
  const postCmtMutation = api.post.comment.useMutation({
    onSuccess: () => {
      refresh();
    },
    onError: (e) => setErrorMessage(e.message)
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setPage(0);
    setComments([]);

    !postMutation.isLoading &&
      postMutation.mutate({
        postId: postId,
        page: 0,
        itemsPerPage: ITEM_PER_PAGE
      });

    setContent("");
  };

  const insertComment = () => {
    userId &&
      !postCmtMutation.isLoading &&
      postCmtMutation.mutate({
        content: content,
        userId: userId,
        postId: postId
      });
  };

  const infiniteRender = () => {
    if (page === -1) return;
    !postMutation.isLoading &&
      postMutation.mutate({
        postId: postId,
        page: page,
        itemsPerPage: ITEM_PER_PAGE
      });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Bình luận",
          animation: "slide_from_bottom",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onBackground,
          statusBarColor: colors.onSurfaceDisabled
        }}
      />

      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            keyboardShouldPersistTaps={"always"}
            onRefresh={() => refresh()}
            refreshing={postMutation.isLoading}
            contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
            data={comments}
            renderItem={({ item }: { item: CommentModel }) => (
              <View style={{ paddingHorizontal: 16 }}>
                <CommentItem item={item} />
              </View>
            )}
            onEndReached={() => infiniteRender()}
          />
        </View>

        {/*<CommentFooter userInfo={props.userInfo}/>*/}

        <View
          className={"flex-row space-x-2"}
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.outline,
            paddingVertical: 8,
            paddingHorizontal: 16
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: colors.outline,
              paddingVertical: 8,
              paddingHorizontal: 12
            }}
          >
            <TextInput
              placeholder={"Viết bình luận..."}
              multiline
              style={{ maxHeight: 200 }}
              onChangeText={(text) => setContent(text)}
              value={content}
            />
          </View>
          <Ionicons
            name={"send-sharp"}
            size={30}
            color={colors.primary}
            style={{ paddingTop: 8 }}
            onPress={() => {
              insertComment();
            }}
          />
        </View>
      </View>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default CommentScreen;
