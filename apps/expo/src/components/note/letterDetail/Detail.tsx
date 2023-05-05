import { useNavigation } from "expo-router";

import React, { useEffect } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { api } from "../../../utils/api";
import Body from "../../Body";
import { NoteMessageList } from "./NoteMessageList";
import MessageComponent from "./MessageComponent";
import MuiIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import CustomCard from "../../CustomCard";
import TeacherStatus from "./TeacherStatus";
import ParentStatus from "./ParentStatus";
import LoadingBar from "../../common/LoadingBar";

const Detail = ({
  userId,
  id,
  isTeacher
}: {
  userId: string;
  id: string;
  isTeacher: boolean;
}) => {
  const theme = useTheme();

  const { data, refetch, isFetching, isSuccess } =
    api.note.getNoteThread.useQuery(
      {
        noteThreadId: id
      },
      {
        onSuccess: (data) => {
          if (data.status !== "Success") console.log(data.message);
          else {
            // console.log(data.noteThread);
          }
        }
      }
    );

  // fetch data when focus
  const navigation = useNavigation();
  const fetchData = () => {
    refetch().catch((e: Error) => {
      console.log(e);
    });
  };
  useEffect(() => {
    const focusListener = navigation.addListener("focus", fetchData);
    return focusListener;
  }, []);

  const photoList = data?.noteThread?.photos;
  return (
    <Body>
      <LoadingBar isFetching={isFetching} />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        {isSuccess && data.noteThread && (
          <View className="m-2 flex-1 p-3 pb-0">
            <Text className="mb-3 text-center" variant={"titleMedium"}>
              {`Lời nhắn cho bé ${data.noteThread.studentName}`}
            </Text>
            <View className="mb-3 flex-row">
              <Text variant={"labelLarge"}>Từ ngày</Text>
              <Text className={"flex-grow text-right"} variant={"bodyMedium"}>
                <FontAwesomeIcon
                  name="calendar"
                  size={16}
                  color={theme.colors.primary}
                />{" "}
                {moment(data.noteThread.startDate).format("DD/MM/YY")}
              </Text>
            </View>

            <View className="mb-3 flex-row">
              <Text variant={"labelLarge"}>Đến ngày</Text>
              <Text className={"flex-grow text-right"} variant={"bodyMedium"}>
                <FontAwesomeIcon
                  name="calendar"
                  size={16}
                  color={theme.colors.primary}
                />{" "}
                {moment(data.noteThread.endDate).format("DD/MM/YY")}
              </Text>
            </View>

            <View className="mb-3 flex-row">
              <Text variant={"labelLarge"}>Đơn tạo bởi</Text>
              <Text
                className={"flex-grow items-center text-right"}
                variant={"bodyMedium"}
              >
                <MuiIcons
                  name="account"
                  size={16}
                  color={theme.colors.primary}
                />{" "}
                {data.noteThread.createdByParent}
              </Text>
            </View>

            <Text className="mb-3" variant={"labelLarge"}>
              Nội dung
            </Text>
            <CustomCard>
              <Text style={{ fontSize: theme.fonts.bodyMedium.fontSize }}>
                {data.noteThread.content ?? "Không có noi dung"}
              </Text>
            </CustomCard>

            <Text className="my-3" variant={"labelLarge"}>
              Ảnh đính kèm
            </Text>
            {photoList && photoList.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {photoList.map((image, index) => (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${image}` }}
                    className="h-32 w-32"
                    key={index}
                  />
                ))}
              </ScrollView>
            ) : (
              <View
                className="rounded-sm border p-4"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.outline
                }}
              >
                <Text className={"text-center leading-6"}>
                  Đơn này không có ảnh!
                </Text>
              </View>
            )}

            {isTeacher ? (
              <TeacherStatus
                userId={userId}
                status={data.noteThread.status}
                refetch={fetchData}
                noteThreadId={id}
              />
            ) : (
              <ParentStatus status={data.noteThread.status} />
            )}
            <Text className="mb-3" variant={"labelLarge"}>
              Các bình luận
            </Text>

            {data.noteThread.messages.length > 0 ? (
              <NoteMessageList
                userId={userId}
                items={data.noteThread.messages.map((item) => {
                  // console.log(item.userId);
                  return {
                    sendUser: item.user,
                    content: item.content,
                    id: item.id,
                    sendTime: item.createdAt,
                    sendUserId: item.userId
                  };
                })}
              />
            ) : (
              <View
                className="rounded-sm border p-4"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.outline
                }}
              >
                <Text className={"text-center leading-6"}>
                  Đơn này chưa có bình luận!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <MessageComponent userId={userId} noteThreadId={id} refetch={fetchData} />
    </Body>
  );
};

export default Detail;
