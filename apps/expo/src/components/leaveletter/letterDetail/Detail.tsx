import { useNavigation } from "expo-router";

import moment from "moment";
import React, { useEffect } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { ProgressBar, Text, useTheme } from "react-native-paper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MuiIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { api } from "../../../utils/api";
import ParentStatus from "./ParentStatus";
import TeacherStatus from "./TeacherStatus";
import Body from "../../Body";
import CustomCard from "../../CustomCard";

const Detail = ({
  userId,
  id,
  isTeacher,
  studentName
}: {
  userId: string;
  id: string;
  isTeacher: boolean;
  studentName: string;
}) => {
  const theme = useTheme();
  const { data, refetch, isFetching, isSuccess } =
    api.leaveletter.getLeaveLetter.useQuery(
      {
        leaveLetterId: id
      },
      {
        onSuccess: (data) => {
          if (data.status !== "Success") console.log(data.message);
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

  const photoList = data?.leaveLetter?.photos;

  return (
    <Body>
      {isFetching && <ProgressBar indeterminate visible={true} />}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        {isSuccess && data.leaveLetter && (
          <View className="m-2 flex-1 p-3">
            <Text className="mb-3 text-center" variant={"titleMedium"}>
              {`Đơn xin nghỉ cho bé ${studentName}`}
            </Text>
            <View className="mb-3 flex-row">
              <Text className="font-bold" variant={"bodyMedium"}>
                Từ ngày
              </Text>
              <Text className={"flex-grow text-right"} variant={"bodyMedium"}>
                <FontAwesomeIcon
                  name="calendar"
                  size={16}
                  color={theme.colors.primary}
                />{" "}
                {moment(data.leaveLetter.startDate).format("DD/MM/YY")}
              </Text>
            </View>

            <View className="mb-3 flex-row">
              <Text className="font-bold" variant={"bodyMedium"}>
                Đến ngày
              </Text>
              <Text className={"flex-grow text-right"} variant={"bodyMedium"}>
                <FontAwesomeIcon
                  name="calendar"
                  size={16}
                  color={theme.colors.primary}
                />{" "}
                {moment(data.leaveLetter.endDate).format("DD/MM/YY")}
              </Text>
            </View>

            <View className="mb-3 flex-row">
              <Text className="font-bold" variant={"bodyMedium"}>
                Đơn tạo bởi
              </Text>
              <Text
                className={"flex-grow items-center text-right"}
                variant={"bodyMedium"}
              >
                <MuiIcons
                  name="account"
                  size={16}
                  color={theme.colors.primary}
                />{" "}
                {data.leaveLetter.createdByParent}
              </Text>
            </View>

            <Text className="mb-3" variant={"labelLarge"}>
              Lý do
            </Text>
            <CustomCard>
              <Text style={{ fontSize: theme.fonts.bodyMedium.fontSize }}>
                {data.leaveLetter.reason ?? "Không có ghi chú"}
              </Text>
            </CustomCard>

            <View className="my-3 flex flex-row items-end justify-between">
              <Text variant={"labelLarge"}>Ảnh đính kèm</Text>
            </View>
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
          </View>
        )}
      </ScrollView>
    </Body>
  );
};

export default Detail;
