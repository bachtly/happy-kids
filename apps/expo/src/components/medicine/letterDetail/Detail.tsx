import { useNavigation } from "expo-router";

import moment from "moment";
import React, { useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ProgressBar, Text, useTheme } from "react-native-paper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MuiIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { api } from "../../../utils/api";
import Body from "../../Body";
import CustomCard from "../../CustomCard";
import MedicineBatchList from "./MedicineBatchList";
import ParentStatus from "./ParentStatus";
import TeacherStatus from "./TeacherStatus";

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
    api.medicine.getMedicineLetter.useQuery(
      {
        medicineLetterId: id
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

  const medicineList = data?.medicineLetter?.medicines;

  return (
    <Body>
      {isFetching && <ProgressBar indeterminate visible={true} />}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        {isSuccess && data.medicineLetter && (
          <View className="m-2 flex-1 p-3">
            <Text className="mb-3 text-center" variant={"titleMedium"}>
              {`Đơn dặn thuốc cho bé ${studentName}`}
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
                {moment(data.medicineLetter.startDate).format("DD/MM/YY")}
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
                {moment(data.medicineLetter.endDate).format("DD/MM/YY")}
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
                {data.medicineLetter.createdByParent}
              </Text>
            </View>

            <Text className="mb-3" variant={"labelLarge"}>
              Ghi chú
            </Text>
            <CustomCard>
              <Text style={{ fontSize: theme.fonts.bodyMedium.fontSize }}>
                {data.medicineLetter.note ?? "Không có ghi chú"}
              </Text>
            </CustomCard>
            <View className="my-3 flex flex-row items-end justify-between">
              <Text variant={"labelLarge"}>Đơn thuốc</Text>
            </View>
            {medicineList && medicineList.length > 0 ? (
              <View>
                <MedicineBatchList
                  medicineList={medicineList}
                  batchList={data.medicineLetter.batchList}
                />
              </View>
            ) : (
              <View
                className="rounded-sm border p-4"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: "gray"
                }}
              >
                <Text className={"text-center leading-6"}>
                  Đơn này không có thuốc!
                </Text>
              </View>
            )}
            {isTeacher ? (
              <TeacherStatus
                userId={userId}
                status={data.medicineLetter.status}
                refetch={fetchData}
                isFetching={isFetching}
                medicineLetterId={id}
                medUseTimes={data.medicineLetter.useDiary}
              />
            ) : (
              <ParentStatus
                status={data.medicineLetter.status}
                updatedByTeacher={data.medicineLetter.updatedByTeacher}
                medUseTimes={data.medicineLetter.useDiary}
              />
            )}
          </View>
        )}
      </ScrollView>
    </Body>
  );
};

export default Detail;
