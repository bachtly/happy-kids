import { Stack, useSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, Text, TextInput, useTheme } from "react-native-paper";
import MyImagePicker from "../../../src/components/ImagePicker";
import { AttendanceItemModel } from "../../../src/models/AttendanceModels";
import { api } from "../../../src/utils/api";

const DATE_OF_WEEK = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy"
];
const DATE_FORMAT = "DD/MM/YYYY";
const TIME_FORMAT = "hh:mm";

const DetailScreen = () => {
  const { id } = useSearchParams();
  const theme = useTheme();

  const [attendance, setAttendance] = useState<AttendanceItemModel | null>(
    null
  );

  const attMutation = api.attendance.getAttendanceItemDetail.useMutation({
    onSuccess: (resp) => setAttendance(resp.attendance)
  });

  // update list when search criterias change
  useEffect(() => {
    id != null &&
      attMutation.mutate({
        id: id
      });
  }, []);

  const getDateString = (date: Date, format: string) => {
    return `${DATE_OF_WEEK[date.getDay()] ?? ""}, ${moment(date)
      .format(format)
      .toString()}`;
  };

  const getTimeString = (time: Date | null | undefined, format: string) => {
    return time ? `${moment(time).format(format).toString()}` : "" ?? "";
  };

  return (
    <ScrollView>
      <Stack.Screen options={{ title: "Chi tiết diểm danh" }} />

      <View className={"flex-1 bg-white p-5"}>
        <View className={"mb-5"}>
          {attendance && attendance.date && (
            <Text variant={"titleLarge"}>
              {getDateString(attendance.date, DATE_FORMAT)}
            </Text>
          )}
        </View>

        <View className={"mb-5"}>
          <View className={"mb-5"}>
            <Text variant={"titleMedium"}>Điểm danh đến</Text>
          </View>
          <View className={"mb-2 flex-row justify-between"}>
            <Text>Giáo viên: </Text>
            <Text>{attendance?.checkinTeacherFullname ?? ""}</Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2 flex-row justify-between"}>
            <Text>Thời gian: </Text>
            <Text>{getTimeString(attendance?.checkinTime, TIME_FORMAT)}</Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2"}>
            <Text className={"mb-2"}>Ghi chú của giáo viên: </Text>
            <TextInput
              disabled={true}
              style={{ fontSize: theme.fonts.bodyMedium.fontSize }}
            >
              {attendance?.checkinNote ?? "Không có ghi chú"}
            </TextInput>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2"}>
            <Text className={"mb-2"}>Hình ảnh:</Text>
            {attendance && attendance.checkinPhotoUrl && (
              <View className={"h-24 w-24"}>
                <MyImagePicker
                  imageData={attendance?.checkinPhotoUrl ?? ""}
                  setImageData={() => {}}
                  disabled={true}
                />
              </View>
            )}
          </View>
          <Divider className={"mb-2"} />
        </View>

        <View>
          <View className={"mb-5"}>
            <Text variant={"titleMedium"}>Điểm danh về</Text>
          </View>

          <View className={"mb-2 flex-row justify-between"}>
            <Text>Giáo viên: </Text>
            <Text>{attendance?.checkoutTeacherFullname ?? ""}</Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2 flex-row justify-between"}>
            <Text>Thời gian: </Text>
            <Text>{getTimeString(attendance?.checkoutTime, TIME_FORMAT)}</Text>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2"}>
            <Text className={"mb-2"}>Ghi chú của giáo viên: </Text>
            <TextInput
              disabled={true}
              style={{ fontSize: theme.fonts.bodyMedium.fontSize }}
            >
              {attendance?.checkoutNote ?? "Không có ghi chú"}
            </TextInput>
          </View>
          <Divider className={"mb-2"} />

          <View className={"mb-2"}>
            <Text className={"mb-2"}>Hình ảnh:</Text>
            {attendance && attendance.checkoutPhotoUrl && (
              <View className={"h-24 w-24"}>
                <MyImagePicker
                  imageData={attendance?.checkoutPhotoUrl ?? ""}
                  setImageData={() => {}}
                  disabled={true}
                />
              </View>
            )}
          </View>
          <Divider className={"mb-2"} />
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;
