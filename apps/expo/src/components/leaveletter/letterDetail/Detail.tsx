import { useNavigation } from "expo-router";

import moment from "moment";
import React, { useContext, useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Text, Divider } from "react-native-paper";
import { api } from "../../../utils/api";
import ParentStatus from "./ParentStatus";
import TeacherStatus from "./TeacherStatus";
import Body from "../../Body";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import { useAuthContext } from "../../../utils/auth-context-provider";
import { ErrorContext } from "../../../utils/error-context";
import LoadingBar from "../../common/LoadingBar";
import EllipsedText from "../../common/EllipsedText";
import MultiImageView from "../../common/MultiImageView";

const Detail = ({
  id,
  isTeacher,
  studentName
}: {
  id: string;
  isTeacher: boolean;
  studentName: string;
}) => {
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const { data, refetch, isFetching, isSuccess } =
    api.leaveletter.getLeaveLetter.useQuery(
      {
        leaveLetterId: id
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

  const photoList = data?.leaveLetter?.photos;

  return (
    <Body>
      <LoadingBar isFetching={isFetching} />
      <ScrollView
        className="flex-1 bg-white"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        {isSuccess && data.leaveLetter && (
          <View className="flex-1 px-5 pb-5">
            {isTeacher ? (
              <TeacherStatus
                status={data.leaveLetter.status}
                refetch={fetchData}
                isFetching={isFetching}
                leaveLetterId={id}
              />
            ) : (
              <ParentStatus
                status={data.leaveLetter.status}
                updatedByTeacher={data.leaveLetter.updatedByTeacher}
              />
            )}

            <Divider />
            <View className={"space-y-1 py-3"}>
              <Text className={"mb-2"} variant={"labelLarge"}>
                Chi tiết đơn
              </Text>

              <View className="flex-row justify-between">
                <Text>Học sinh</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {studentName}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Từ ngày</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {moment(data.leaveLetter.startDate).format("DD/MM/YY")}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Đến ngày</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {moment(data.leaveLetter.endDate).format("DD/MM/YY")}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Đơn tạo bởi</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {data.leaveLetter.createdByParent}
                </Text>
              </View>
            </View>

            <Divider />
            <View className={"space-y-1 py-3"}>
              <Text className="mb-3" variant={"labelLarge"}>
                Lý do
              </Text>
              <EllipsedText
                lines={10}
                content={data.leaveLetter.reason ?? "Không có ghi chú"}
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
