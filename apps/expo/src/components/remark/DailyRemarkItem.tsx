import { Text, useTheme, IconButton } from "react-native-paper";
import { View, TextInput } from "react-native";
import moment from "moment";
import {
  DAILY_REMARK_ACTIVITY_VERBOSE,
  DailyRemarkModel
} from "../../models/DailyRemarkModels";
import CustomCard from "../CustomCard";
import React, { useState } from "react";
import AddDailyRemarkModal from "./AddDailyRemarkModal";
import UserWithAvatar from "../common/UserWithAvatar";

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
        <UserWithAvatar
          avatar={isTeacher ? item.studentAvatar : item.teacherAvatar}
          name={isTeacher ? item.studentFullname : item.teacherFullname}
          extraInfo={
            item.date
              ? getDateString(item.date, DATE_FORMAT)
              : getDateString(date, DATE_FORMAT)
          }
          rightButton={
            isTeacher ? (
              <IconButton
                icon={"pencil"}
                iconColor={colors.primary}
                size={16}
                mode={"outlined"}
                onPress={() => setAddRemarkModalVisible(true)}
              />
            ) : undefined
          }
        />
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
        <AddDailyRemarkModal
          visible={addRemarkModalVisible}
          close={() => {
            setAddRemarkModalVisible(false);
            refresh && refresh();
          }}
          submit={() => {
            setAddRemarkModalVisible(false);
            refresh && refresh();
          }}
          remark={item}
        />
      )}
    </CustomCard>
  );
};

export default DailyRemarkItem;
