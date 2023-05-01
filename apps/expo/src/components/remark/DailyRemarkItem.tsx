import { Text, useTheme, Avatar } from "react-native-paper";
import { View, TextInput } from "react-native";
import moment from "moment";
import {
  DAILY_REMARK_ACTIVITY_VERBOSE,
  DailyRemarkModel
} from "../../models/DailyRemarkModels";
import defaultAvatar from "../../../assets/images/default-user-avatar.png";
import UnderlineButton from "../common/UnderlineButton";
import CustomCard from "../CustomCard";
import { useState } from "react";
import AddDailyRemarkModal from "./AddDailyRemarkModal";

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

const DailyRemarkItem = ({
  item,
  isTeacher,
  refresh,
  date
}: {
  item: DailyRemarkModel;
  isTeacher: boolean;
  refresh?: () => void;
  date?: Date;
}) => {
  const { colors } = useTheme();
  const [addRemarkModalVisible, setAddRemarkModalVisible] = useState(false);

  const getDateString = (date: Date | null | undefined, format: string) => {
    if (!date) return "";

    return `${DATE_OF_WEEK[date.getDay()] ?? ""}, ${moment(date)
      .format(format)
      .toString()}`;
  };

  return (
    <CustomCard>
      {/*The account header*/}
      <View className={"mb-3 flex-row space-x-3"}>
        <Avatar.Image
          className={"my-auto"}
          source={
            isTeacher
              ? item.studentAvatar
                ? { uri: `data:image/jpeg;base64,${item.studentAvatar}` }
                : defaultAvatar
              : item.teacherAvatar
              ? { uri: `data:image/jpeg;base64,${item.teacherAvatar}` }
              : defaultAvatar
          }
          size={42}
        />
        <View className={"justify-center"}>
          <Text className={""} variant={"titleSmall"}>
            {isTeacher ? item.studentFullname : item.teacherFullname}
          </Text>
          <Text className={"italic"} variant={"bodyMedium"}>
            {item.date
              ? getDateString(item.date, DATE_FORMAT)
              : getDateString(date, DATE_FORMAT)}
          </Text>
        </View>
      </View>

      {item.id ? (
        <View className={"space-y-3"}>
          {item.activities.map((activity, key) => (
            <View key={key} className={""}>
              <Text variant={"labelLarge"}>
                {activity.activity
                  ? DAILY_REMARK_ACTIVITY_VERBOSE.get(activity.activity)
                  : ""}
              </Text>
              <TextInput
                value={activity.content ?? ""}
                multiline={true}
                editable={false}
                style={{ color: colors.onBackground }}
              />
            </View>
          ))}
        </View>
      ) : (
        <TextInput
          value={"Chưa có nhận xét"}
          multiline={true}
          editable={false}
          style={{ color: colors.onBackground }}
        />
      )}

      {isTeacher && (
        <>
          <View className={"mt-1"} style={{ alignSelf: "flex-end" }}>
            <UnderlineButton
              onPress={() => {
                setAddRemarkModalVisible(true);
              }}
            >
              Thêm nhận xét
            </UnderlineButton>
          </View>
          <AddDailyRemarkModal
            visible={addRemarkModalVisible}
            close={() => setAddRemarkModalVisible(false)}
            submit={() => {
              setAddRemarkModalVisible(false);
              refresh && refresh();
            }}
            remark={item}
          />
        </>
      )}
    </CustomCard>
  );
};

export default DailyRemarkItem;
