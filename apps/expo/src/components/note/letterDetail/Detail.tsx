import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Text, Divider } from "react-native-paper";
import { api } from "../../../utils/api";
import Body from "../../Body";
import moment from "moment";
import TeacherStatus from "./TeacherStatus";
import ParentStatus from "./ParentStatus";
import LoadingBar from "../../common/LoadingBar";
import AntDesign from "react-native-vector-icons/AntDesign";
import EllipsedText from "../../common/EllipsedText";
import MultiImageView from "../../common/MultiImageView";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import { ErrorContext } from "../../../utils/error-context";
import { useAuthContext } from "../../../utils/auth-context-provider";

const Detail = ({
  userId,
  id,
  isTeacher
}: {
  userId: string;
  id: string;
  isTeacher: boolean;
}) => {
  const router = useRouter();
  const errorContext = useContext(ErrorContext);
  const authContext = useAuthContext();

  const { data, refetch, isFetching, isSuccess } =
    api.note.getNoteThread.useQuery(
      {
        noteThreadId: id
      },
      {
        onError: ({ message, data }) =>
          trpcErrorHandler(() => {})(
            data?.code ?? "",
            message,
            errorContext,
            authContext
          )
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

  const routeThreadScreen = () => {
    router.push({
      pathname: isTeacher
        ? "teacher/note/thread-screen"
        : "parent/note/thread-screen",
      params: { userId, id }
    });
  };

  const photoList = data?.noteThread?.photos;
  return (
    <Body>
      <LoadingBar isFetching={isFetching} />

      <ScrollView
        className="flex-1 bg-white"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        {isSuccess && data.noteThread && (
          <View className="flex-1 px-5 pb-5">
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

            <Divider />
            <View className="flex-row justify-between py-3">
              <Text variant={"labelLarge"}>Phản hồi</Text>
              <AntDesign
                name={"message1"}
                size={25}
                onPress={() => routeThreadScreen()}
              />
            </View>
            <Divider />

            <View className={"space-y-1 py-3"}>
              <Text className={"mb-2"} variant={"labelLarge"}>
                Chi tiết đơn
              </Text>

              <View className="flex-row justify-between">
                <Text>Học sinh</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {data.noteThread.studentName}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Từ ngày</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {moment(data.noteThread.startDate).format("DD/MM/YY")}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Đến ngày</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {moment(data.noteThread.endDate).format("DD/MM/YY")}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Đơn tạo bởi</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {data.noteThread.createdByParent}
                </Text>
              </View>
            </View>

            <Divider />
            <View className={"space-y-1 py-3"}>
              <Text className="mb-3" variant={"labelLarge"}>
                Nội dung
              </Text>
              <EllipsedText
                lines={10}
                content={data.noteThread.content ?? "Không có nội dung"}
              />
            </View>

            {photoList && photoList.length > 0 && (
              <>
                <Divider />
                <View className={"space-y-1 py-3"}>
                  <Text className="mb-3" variant={"labelLarge"}>
                    Ảnh đính kèm
                  </Text>
                  <MultiImageView images={photoList} />
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </Body>
  );
};

export default Detail;
