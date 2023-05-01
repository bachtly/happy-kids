import { PostItemModel } from "../../models/PostModels";
import { FlatList, Image, Pressable, View } from "react-native";
import { Avatar, Card, Text, useTheme } from "react-native-paper";
import moment from "moment";
import EllipsedText from "../common/EllipsedText";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import { useRouter } from "expo-router";

const TIME_FORMAT = "hh:mm DD/MM/YYYY";

const PostItem = ({
  item,
  isTeacher
}: {
  item: PostItemModel;
  isTeacher: boolean;
}) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <>
      <Card
        mode={"elevated"}
        style={{ backgroundColor: colors.background, borderRadius: 2 }}
      >
        <Card.Content>
          <View className={"mb-2 flex-row space-x-2"}>
            <Avatar.Image
              className={"my-auto"}
              size={42}
              source={{
                uri: item.userAvatar
                  ? `data:image/jpeg;base64,${item.userAvatar}`
                  : ""
              }}
            />
            <View>
              <Text className={""} variant={"titleSmall"}>
                {item.userFullname}
              </Text>
              <Text className={"italic"} variant={"bodyMedium"}>
                {moment(item.createdAt).format(TIME_FORMAT)}
              </Text>
            </View>
          </View>

          <View className={"mb-2"}>
            <EllipsedText lines={2} content={item.content ?? ""} />
          </View>

          {(item.photos?.filter((item) => item != "").length as number) > 0 && (
            <FlatList
              contentContainerStyle={{ gap: 4 }}
              data={item.photos}
              horizontal={true}
              renderItem={({ item }: { item: string }) => (
                <Image
                  className={"h-24 w-24"}
                  source={{ uri: `data:image/jpeg;base64,${item}` }}
                />
              )}
            />
          )}

          {/*Reaction and Comment count summary*/}
          {/*<View className={"flex-row"}>*/}
          {/*  <Text>{}</Text>*/}
          {/*  <Text></Text>*/}
          {/*</View>*/}
        </Card.Content>

        <Card.Actions style={{ paddingBottom: 0 }}>
          <View
            className={"mr-2 flex-row"}
            style={{ borderTopWidth: 0.5, borderTopColor: colors.outline }}
          >
            {/*<Pressable className={"flex-1 py-2"} style={{borderRightWidth: 0.5, borderRightColor: colors.outline}}>*/}
            {/*  <Ionicons name={'heart-outline'} style={{textAlign:'center'}} size={25}/>*/}
            {/*  <Text className={"text-center"} variant={"labelSmall"}>Bày tỏ cảm xúc</Text>*/}
            {/*</Pressable>*/}
            <Pressable
              className={"flex-1 py-2"}
              onPress={() =>
                router.push({
                  pathname: isTeacher
                    ? "teacher/post/comment-screen"
                    : "parent/post/comment-screen",
                  params: { postId: item.id }
                })
              }
            >
              <Ionicons
                name={"chatbox-outline"}
                style={{ textAlign: "center" }}
                size={25}
              />
              <Text className={"text-center"} variant={"labelSmall"}>
                Bình luận
              </Text>
            </Pressable>
          </View>
        </Card.Actions>
      </Card>
    </>
  );
};

export default PostItem;
