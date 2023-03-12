import moment from "moment";
import { useState } from "react";
import { View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  RadioButton,
  Text,
  TextInput
} from "react-native-paper";
import { StudentModel } from "../../models/AttendanceModels";
import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";
import MyImagePicker from "../ImagePicker";

enum Status {
  NotCheckedIn = "NotCheckedIn",
  CheckedIn = "CheckedIn",
  AbsenseWithPermission = "AbsenseWithPermission",
  AbsenseWithoutPermission = "AbsenseWithoutPermission"
}

const STATUS_ENUM_TO_VERBOSE = new Map([
  ["CheckedIn", "Đi học"],
  ["AbsenseWithPermission", "Có phép"],
  ["AbsenseWithoutPermission", "Không phép"]
]);
const CheckinItem = (props: StudentModel) => {
  const [image, setImage] = useState("");
  const [status, setStatus] = useState(Status.NotCheckedIn);
  const [note, setNote] = useState("");

  const authContext = useAuthContext();

  const attMutation = api.attendance.checkin.useMutation({});

  return (
    <View className={"mb-3"}>
      <Card>
        <Card.Content>
          <View className={"flex-row space-x-3 mb-2"}>
            <Avatar.Image size={50} source={{ uri: props.avatarUrl ?? "" }} />
            <Text className={"my-auto"} variant={"titleSmall"}>
              {props.fullname}
            </Text>
          </View>

          <View className={"flex-row mb-2 justify-between"}>
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
                />
                <Text className={"m-auto"}>
                  {STATUS_ENUM_TO_VERBOSE.get(itemStatus.toString())}
                </Text>
              </View>
            ))}
          </View>

          <View className={"flex-row space-x-3"}>
            <View style={{ height: 80, width: 80, margin: "auto" }}>
              <MyImagePicker imageData={image} setImageData={setImage} />
            </View>
            <TextInput
              className={"flex-1"}
              onChangeText={(text) => setNote(text.toString())}
              outlineStyle={{ padding: 0 }}
              contentStyle={{ margin: 0, padding: 1 }}
              placeholder={"Ghi chú"}
              style={{ top: -6, height: 78 }}
              multiline={true}
              mode={"outlined"}
            />
          </View>

          <Button
            onPress={() => {
              const time = moment(moment.now());
              const studentId = props.id;
              const teacherId = authContext.userId;

              teacherId &&
                attMutation.mutate({
                  studentId: studentId,
                  status: status,
                  note: note,
                  time: time.toDate(),
                  photoUrl: props.avatarUrl,
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
