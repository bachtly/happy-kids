import { Text, useTheme, Avatar } from "react-native-paper";
import { View, TextInput } from "react-native";
import moment, { Moment } from "moment";
import defaultAvatar from "../../../assets/images/default-user-avatar.png";
import { PeriodRemarkModel } from "../../models/PeriodRemarkModels";
import CustomCard from "../CustomCard";
import UnderlineButton from "../common/UnderlineButton";
import { useState } from "react";
import AddPeriodRemarkModal from "./AddPeriodRemarkModal";

const MONTH_FORMAT = "MM/YYYY";

const PeriodRemarkItem = ({
  item,
  isTeacher,
  time,
  refresh
}: {
  item: PeriodRemarkModel;
  isTeacher: boolean;
  time: Moment;
  refresh?: () => void;
}) => {
  const { colors } = useTheme();

  const [addRemarkModalVisible, setAddRemarkModalVisible] = useState(false);

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
            Tháng{" "}
            {item.startTime
              ? moment(item.startTime).format(MONTH_FORMAT)
              : moment(time).format(MONTH_FORMAT)}
          </Text>
        </View>
      </View>

      {item.id ? (
        <TextInput
          value={item.content ?? ""}
          multiline={true}
          editable={false}
          style={{ color: colors.onBackground }}
        />
      ) : (
        <TextInput
          value={"Chưa có nhận xét"}
          multiline={true}
          editable={false}
          style={{ color: colors.onBackground }}
        />
      )}

      {isTeacher && !item.id && (
        <>
          <View className={"mt-1"}>
            <UnderlineButton
              onPress={() => {
                setAddRemarkModalVisible(true);
              }}
            >
              Thêm nhận xét
            </UnderlineButton>
          </View>
          <AddPeriodRemarkModal
            visible={addRemarkModalVisible}
            close={() => setAddRemarkModalVisible(false)}
            submit={() => {
              setAddRemarkModalVisible(false);
              refresh && refresh();
            }}
            remark={item}
            time={time}
          />
        </>
      )}
    </CustomCard>
  );
};

export default PeriodRemarkItem;
