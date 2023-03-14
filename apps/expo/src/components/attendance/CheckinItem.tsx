import moment from "moment";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  RadioButton,
  Text,
  TextInput
} from "react-native-paper";
import {
  AttendanceStudentModel,
  STATUS_ENUM_TO_VERBOSE
} from "../../models/AttendanceModels";
import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";
import MyImagePicker from "../ImagePicker";

enum Status {
  NotCheckedIn = "NotCheckedIn",
  CheckedIn = "CheckedIn",
  AbsenseWithPermission = "AbsenseWithPermission",
  AbsenseWithoutPermission = "AbsenseWithoutPermission"
}

interface CheckinItemProps {
  attendanceStudentModel: AttendanceStudentModel;
  refresh: () => void;
}

const CheckinItem = (props: CheckinItemProps) => {
  const [image, setImage] = useState("");
  const [status, setStatus] = useState(
    props.attendanceStudentModel.attendanceStatus || Status.NotCheckedIn
  );
  const [note, setNote] = useState("");
  const [isFilled, setIsFilled] = useState(false);

  const authContext = useAuthContext();

  const attMutation = api.attendance.checkin.useMutation({
    onSuccess: () => props.refresh()
  });

  useEffect(() => {
    setIsFilled(
      props.attendanceStudentModel.attendanceStatus != null &&
        props.attendanceStudentModel.attendanceStatus !=
          Status.NotCheckedIn.toString()
    );
  });

  return (
    <View className={"mb-3"}>
      <Card>
        <Card.Content>
          <View className={"flex-row space-x-2 mb-3"}>
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

          <View
            className={"flex-row mb-3 justify-between"}
            style={{ left: -8 }}
          >
            {[
              Status.CheckedIn,
              Status.AbsenseWithPermission,
              Status.AbsenseWithoutPermission
            ].map((itemStatus, key) => (
              <View key={key} className={"flex-row"}>
                <RadioButton
                  value={itemStatus.toString()}
                  status={status == itemStatus ? "checked" : "unchecked"}
                  onPress={() => setStatus(itemStatus)}
                  disabled={isFilled}
                />
                <Text className={"m-auto"}>
                  {STATUS_ENUM_TO_VERBOSE.get(itemStatus.toString())}
                </Text>
              </View>
            ))}
          </View>

          <View className={"mb-3"}>
            <TextInput
              className={"flex-1"}
              onChangeText={(text) => setNote(text.toString())}
              outlineStyle={{ padding: 0 }}
              contentStyle={{ margin: 0, padding: 1 }}
              placeholder={
                props.attendanceStudentModel.attendanceCheckinNote ||
                "Ghi chú ..."
              }
              multiline={true}
              disabled={isFilled}
            />
          </View>

          <View className={"w-20 h-20 mb-3"}>
            <MyImagePicker
              imageData={image}
              setImageData={setImage}
              disabled={isFilled}
            />
          </View>

          <Button
            mode={"outlined"}
            disabled={isFilled}
            onPress={() => {
              const time = moment(moment.now());
              const studentId = props.attendanceStudentModel.id;
              const teacherId = authContext.userId;

              teacherId &&
                attMutation.mutate({
                  studentId: studentId,
                  status: status,
                  note: note,
                  time: time.toDate(),
                  photoUrl: props.attendanceStudentModel.avatarUrl,
                  teacherId: teacherId
                });
            }}
          >
            Điểm danh
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default CheckinItem;
