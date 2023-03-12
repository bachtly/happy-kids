import moment from "moment";
import { useState } from "react";
import { View } from "react-native";
import { Avatar, Button, Card, Text, TextInput } from "react-native-paper";
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
const CheckOutItem = (props: StudentModel) => {
  const [image, setImage] = useState("");
  const [status, setStatus] = useState(Status.NotCheckedIn);
  const [note, setNote] = useState("");
  const [insertSuccess, setInsertSuccess] = useState<boolean>(null);

  const authContext = useAuthContext();

  const attMutation = api.attendance.checkIn.useMutation({
    onSuccess: (resp) => setInsertSuccess(true)
  });

  return (
    <View className={"mb-3"}>
      <Card>
        <Card.Content>
          <View className={"flex-row space-x-3"}>
            <Avatar.Image size={50} source={{ uri: props.avatarUrl ?? "" }} />
            <Text className={"my-auto"} variant={"titleSmall"}>
              {props.fullname}
            </Text>
          </View>

          <Button className={"mb-2"} onPress={() => {}}>
            Chọn người đón
          </Button>

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
              const studentId = authContext.studentId;
              const teacherId = authContext.userId;

              teacherId &&
                studentId &&
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

export default CheckOutItem;
