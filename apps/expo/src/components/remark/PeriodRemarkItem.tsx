import { Text, useTheme, IconButton } from "react-native-paper";
import moment, { Moment } from "moment";
import { PeriodRemarkModel } from "../../models/PeriodRemarkModels";
import CustomCard from "../CustomCard";
import React, { useState } from "react";
import AddPeriodRemarkModal from "./AddPeriodRemarkModal";
import UserWithAvatar from "../common/UserWithAvatar";

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
      <UserWithAvatar
        avatar={isTeacher ? item.studentAvatar : item.teacherAvatar}
        name={isTeacher ? item.studentFullname : item.teacherFullname}
        extraInfo={`Tháng ${
          item.startTime
            ? moment(item.startTime).format(MONTH_FORMAT)
            : moment(time).format(MONTH_FORMAT)
        }`}
        rightButton={
          isTeacher ? (
            <IconButton
              icon={"pencil"}
              iconColor={colors.primary}
              size={16}
              mode={"outlined"}
              onPress={() => {
                setAddRemarkModalVisible(true);
                console.log("fuxk", addRemarkModalVisible);
              }}
            />
          ) : undefined
        }
      />

      {item.id ? (
        <Text style={{ color: colors.onBackground }}>{item.content ?? ""}</Text>
      ) : (
        <Text style={{ color: colors.onBackground }}>Chưa có nhận xét</Text>
      )}

      {isTeacher && (
        <>
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
