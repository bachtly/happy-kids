import { useSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import MyImagePicker from "../../src/components/ImagePicker";
import { AttendanceItemModel } from "../../src/models/AttendanceModels";
import { api } from "../../src/utils/api";

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

const STATUS_ENUM_TO_VERBOSE = new Map([
  ["NotCheckedIn", "Chưa điểm danh"],
  ["CheckedIn", "Đã điểm danh"],
  ["AbsenseWithPermission", "Vắng có phép"],
  ["AbsenseWithoutPermission", "Vắng không phép"]
]);

const AttendanceDetail = () => {
  const { id } = useSearchParams();

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

  const getTimeString = (time: Date, format: string) => {
    return `${moment(time).format(format).toString()}`;
  };

  return (
    <View className={"flex-1 bg-white p-5"}>
      <View className={"mb-2"}>
        {attendance && attendance.date && (
          <Text variant={"titleMedium"}>
            {getDateString(attendance.date, DATE_FORMAT)}
          </Text>
        )}
      </View>

      <View className={"mb-2"}>
        <View className={"mb-2"}>
          <Text variant={"titleSmall"}>Điểm danh đến</Text>
        </View>
        <Text>Giáo viên: {attendance?.teacherFullname ?? ""}</Text>
        <Text>
          Thời gian:{" "}
          {attendance?.checkinTime
            ? getTimeString(attendance.checkinTime, TIME_FORMAT)
            : ""}
        </Text>
        <Text>Ghi chú của giáo viên: {attendance?.checkinNote ?? ""}</Text>
        <Text>Hình ảnh:</Text>
        {attendance && attendance.checkinPhotoUrl && (
          <MyImagePicker
            imageData={attendance?.checkinPhotoUrl}
            setImageData={() => {}}
          />
        )}
      </View>

      <View>
        <View className={"mb-2"}>
          <Text variant={"titleSmall"}>Điểm danh về</Text>
        </View>
        <Text>Giáo viên: {attendance?.teacherFullname ?? ""}</Text>
        <Text>
          Thời gian:{" "}
          {attendance?.checkoutTime
            ? getTimeString(attendance.checkoutTime, TIME_FORMAT)
            : ""}
        </Text>
        <Text>Ghi chú của giáo viên: {attendance?.checkinNote ?? ""}</Text>
        <Text>Hình ảnh:</Text>
      </View>
    </View>
  );
};

export default AttendanceDetail;
