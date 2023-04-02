import { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import {
  AttendanceStudentModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/AttendanceModels";
import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";
import MyImagePicker from "../ImagePicker";
import CustomCard from "../CustomCard";

enum Status {
  NotCheckedIn = "NotCheckedIn",
  CheckedIn = "CheckedIn",
  AbsenseWithPermission = "AbsenseWithPermission",
  AbsenseWithoutPermission = "AbsenseWithoutPermission"
}

interface CheckoutItemProps {
  attendanceStudentModel: AttendanceStudentModel;
  refresh: () => void;
  date: Date;
}

const CheckoutItem = (props: CheckoutItemProps) => {
  const [image, setImage] = useState("");
  const [note, setNote] = useState("");
  const [isFilled, setIsFilled] = useState(false);

  const authContext = useAuthContext();

  const attMutation = api.attendance.checkout.useMutation({
    onSuccess: () => props.refresh()
  });

  useEffect(() => {
    setIsFilled(
      props.attendanceStudentModel.attendanceStatus == null ||
        props.attendanceStudentModel.attendanceStatus !=
          Status.CheckedIn.toString()
    );
  });

  return (
    <View className={"mb-3"}>
      <CustomCard>
        <View className={"mb-3 flex-row space-x-3"}>
          <Avatar.Image
            className={"my-auto"}
            size={42}
            source={{ uri: props.attendanceStudentModel.avatarUrl ?? "" }}
          />
          <View>
            <Text className={""} variant={"titleSmall"}>
              {props.attendanceStudentModel.fullname}
            </Text>
            <Text className={"italic"} variant={"bodyMedium"}>
              {props.attendanceStudentModel.attendanceStatus &&
                STATUS_ENUM_TO_VERBOSE.get(
                  props.attendanceStudentModel.attendanceStatus
                )}
            </Text>
          </View>
        </View>

        <View className={"mb-3 flex-row space-x-3"}>
          <TextInput
            className={"flex-1"}
            onChangeText={(text) => setNote(text.toString())}
            outlineStyle={{ padding: 0 }}
            contentStyle={{ margin: 0, padding: 1 }}
            placeholder={"Ghi chú"}
            multiline={true}
            disabled={isFilled}
          />
        </View>

        <View className={"mb-3 h-20 w-20"}>
          <MyImagePicker
            imageData={image}
            setImageData={setImage}
            disabled={isFilled}
          />
        </View>

        <Button
          onPress={() => {
            const studentId = props.attendanceStudentModel.id;
            const teacherId = authContext.userId;

            teacherId &&
              attMutation.mutate({
                studentId: studentId,
                note: note,
                time: props.date,
                photoUrl: props.attendanceStudentModel.avatarUrl,
                teacherId: teacherId,
                pickerRelativeId: null
              });
          }}
        >
          Điểm danh
        </Button>
      </CustomCard>
    </View>
  );
};

export default CheckoutItem;
