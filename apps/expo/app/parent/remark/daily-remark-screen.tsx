import { ScrollView, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { api } from "../../../src/utils/api";
import React, { useEffect, useState } from "react";
import { DailyRemarkModel } from "../../../src/models/DailyRemarkModels";
import { useIsFocused } from "@react-navigation/native";
import moment, { Moment } from "moment";
import DailyRemarkItem from "../../../src/components/remark/DailyRemarkItem";
import DateRangeFilterBar from "../../../src/components/date-picker/DateRangeFilterBar";
import Body from "../../../src/components/Body";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const DailyRemarkScreen = ({ studentId }: { studentId: string }) => {
  const isFocused = useIsFocused();
  const [remarkList, setRemarkList] = useState<DailyRemarkModel[]>([]);
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  const remarkMutation = api.dailyRemark.getDailyRemarkList.useMutation({
    onSuccess: (resp) => setRemarkList(resp.remarks)
  });

  // update list when search criterias change
  useEffect(() => {
    remarkMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  }, [studentId, timeStart, timeEnd, isFocused]);

  return (
    <Body>
      {remarkMutation.isLoading && <ProgressBar indeterminate visible={true} />}

      <DateRangeFilterBar
        timeStart={timeStart}
        setTimeStart={setTimeStart}
        timeEnd={timeEnd}
        setTimeEnd={setTimeEnd}
      />

      <ScrollView>
        <View className={"space-y-3 p-2"}>
          {remarkList.map((item, key) => (
            <View key={key}>
              <DailyRemarkItem item={item} isTeacher={false} />
            </View>
          ))}
        </View>
      </ScrollView>
    </Body>
  );
};

export default DailyRemarkScreen;
