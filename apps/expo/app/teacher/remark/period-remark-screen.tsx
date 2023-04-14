import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { PeriodRemarkModel } from "../../../src/models/PeriodRemarkModels";
import PeriodRemarkItem from "../../../src/components/remark/PeriodRemarkItem";
import Body from "../../../src/components/Body";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";

const DEFAULT_TIME = moment(moment.now());

const PeriodRemarkScreen = ({ classId }: { classId: string }) => {
  const isFocused = useIsFocused();
  const [remarkList, setRemarkList] = useState<PeriodRemarkModel[]>([]);

  const [time, setTime] = useState<Moment>(DEFAULT_TIME);

  const remarkMutation =
    api.periodRemark.getPeriodRemarkListFromClassId.useMutation({
      onSuccess: (resp) => setRemarkList(resp.remarks)
    });

  // update list when search criterias change
  useEffect(() => {
    remarkMutation.mutate({
      time: time.toDate(),
      classId: classId ?? ""
    });
  }, [classId, isFocused, time]);

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
              <PeriodRemarkItem
                item={item}
                isTeacher={true}
                time={time}
                refresh={refresh}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </Body>
  );
};

export default PeriodRemarkScreen;