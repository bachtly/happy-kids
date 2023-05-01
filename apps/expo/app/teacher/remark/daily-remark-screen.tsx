import { ScrollView, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { api } from "../../../src/utils/api";
import React, { useEffect, useState } from "react";
import { DailyRemarkModel } from "../../../src/models/DailyRemarkModels";
import { useIsFocused } from "@react-navigation/native";
import moment, { Moment } from "moment";
import DailyRemarkItem from "../../../src/components/remark/DailyRemarkItem";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";
import Body from "../../../src/components/Body";
import AlertModal from "../../../src/components/common/AlertModal";

const DEFAULT_TIME = moment(moment.now());

const DailyRemarkScreen = ({ classId }: { classId: string }) => {
  const isFocused = useIsFocused();
  const [remarkList, setRemarkList] = useState<DailyRemarkModel[]>([]);
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);
  const [errorMessage, setErrorMessage] = useState("");

  const remarkMutation =
    api.dailyRemark.getDailyRemarkListFromClassId.useMutation({
      onSuccess: (resp) => setRemarkList(resp.remarks),
      onError: (e) => setErrorMessage(e.message)
    });

  // update list when search criterias change
  useEffect(() => {
    remarkMutation.mutate({
      time: time.toDate(),
      classId: classId ?? ""
    });
  }, [classId, time, isFocused]);

  const refresh = () => {
    remarkMutation.mutate({
      time: time.toDate(),
      classId: classId ?? ""
    });
  };

  return (
    <Body>
      {remarkMutation.isLoading && <ProgressBar indeterminate visible={true} />}

      <DateFilterBar time={time} setTime={setTime} />

      <ScrollView>
        <View className={"space-y-3 p-2"}>
          {remarkList.map((item, key) => (
            <View key={key}>
              <DailyRemarkItem
                item={item}
                isTeacher={true}
                refresh={refresh}
                date={time.toDate()}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default DailyRemarkScreen;
