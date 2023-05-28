import { useNavigation, useRouter } from "expo-router";

import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Text, useTheme, Divider } from "react-native-paper";
import { api } from "../../../utils/api";
import Body from "../../Body";
import MedicineBatchList from "./MedicineBatchList";
import ParentStatus from "./ParentStatus";
import TeacherStatus from "./TeacherStatus";
import { useAuthContext } from "../../../utils/auth-context-provider";
import { ErrorContext } from "../../../utils/error-context";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import LoadingBar from "../../common/LoadingBar";
import EllipsedText from "../../common/EllipsedText";
import CustomWhiteStackScreen from "../../CustomWhiteStackScreen";
import {
  MedicineLetterStatus,
  MedUseTime
} from "../../../models/MedicineModels";
import MedicineUseTabTable from "./MedicineUseTabTable";

const Detail = ({
  userId,
  id,
  isTeacher
}: {
  userId: string;
  id: string;
  isTeacher: boolean;
  studentName: string;
}) => {
  const theme = useTheme();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [status, setStatus] = useState<MedicineLetterStatus>("NotConfirmed");
  const [curMedUseTimes, setCurMedUseTimes] = useState<MedUseTime[]>([]);
  const [curBatchNumber, setCurBatchNumber] = useState(0);

  const { data, refetch, isFetching, isSuccess } =
    api.medicine.getMedicineLetter.useQuery(
      {
        medicineLetterId: id
      },
      {
        onSuccess: (resp) => {
          resp.medicineLetter && setStatus(resp.medicineLetter.status);
          resp.medicineLetter &&
            setCurMedUseTimes(resp.medicineLetter.useDiary);
        },
        onError: ({ message, data }) =>
          trpcErrorHandler(() => {})(
            data?.code ?? "",
            message,
            errorContext,
            authContext
          )
      }
    );

  const updateStatMedLetterMutation =
    api.medicine.updateMedicineLetter.useMutation({
      onSuccess: (_) => refetch(),
      onError: ({ message, data }) =>
        trpcErrorHandler(() => {})(
          data?.code ?? "",
          message,
          errorContext,
          authContext
        )
    });

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
      <CustomWhiteStackScreen
        title={"Chi tiết dặn thuốc"}
        addButtonHandler={
          !isTeacher
            ? undefined
            : () => {
                updateStatMedLetterMutation.mutate({
                  teacherId: userId,
                  useDiary: curMedUseTimes,
                  medicineLetterId: id,
                  status: status
                });
                router.back();
              }
        }
      />

      <LoadingBar isFetching={isFetching} />

      <ScrollView
        className="flex-1 bg-white"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        {isSuccess && data.medicineLetter && (
          <View className="flex-1 px-5 pb-5">
            {isTeacher ? (
              <TeacherStatus
                status={status}
                setStatus={(status) => setStatus(status)}
              />
            ) : (
              <ParentStatus
                status={data.medicineLetter.status}
                updatedByTeacher={data.medicineLetter.updatedByTeacher}
                medUseTimes={data.medicineLetter.useDiary}
              />
            )}

            {isTeacher && (
              <>
                <Divider />
                <View className={"space-y-1 py-3"}>
                  <View className="flex-row items-baseline justify-between">
                    <Text className="mb-3" variant={"labelLarge"}>
                      Trạng thái uống thuốc
                    </Text>
                  </View>
                  <MedicineUseTabTable
                    medUseTimes={curMedUseTimes}
                    setMedUseTimes={setCurMedUseTimes}
                    curBatchNumber={curBatchNumber}
                    setCurBatchNumber={setCurBatchNumber}
                  />
                </View>
              </>
            )}

            <Divider />
            <View className={"space-y-1 py-3"}>
              <Text className={"mb-2"} variant={"labelLarge"}>
                Chi tiết đơn
              </Text>

              <View className="flex-row justify-between">
                <Text>Từ ngày</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {moment(data.medicineLetter.startDate).format("DD/MM/YY")}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Đến ngày</Text>
                <Text className={"text-right"} variant={"bodyMedium"}>
                  {moment(data.medicineLetter.endDate).format("DD/MM/YY")}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Đơn tạo bởi</Text>
                <Text
                  className={"items-center text-right"}
                  variant={"bodyMedium"}
                >
                  {data.medicineLetter.createdByParent}
                </Text>
              </View>
            </View>

            <Divider />
            <View className={"space-y-1 py-3"}>
              <Text className="mb-3" variant={"labelLarge"}>
                Ghi chú
              </Text>
              <EllipsedText
                lines={10}
                content={data.medicineLetter.note ?? "Không có ghi chú"}
              />
            </View>

            <Divider />
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
          </View>
        )}
      </ScrollView>
    </Body>
  );
};

export default Detail;
