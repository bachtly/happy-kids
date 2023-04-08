import React, { useEffect, useState } from "react";
import { api } from "../../../src/utils/api";
import { ScrollView, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { PeriodRemarkModel } from "../../../src/models/PeriodRemarkModels";
import PeriodRemarkItem from "../../../src/components/remark/PeriodRemarkItem";
import Body from "../../../src/components/Body";
import moment from "moment";

const PeriodRemarkScreen = ({ studentId }: { studentId: string }) => {
  const isFocused = useIsFocused();
  const [remarkList, setRemarkList] = useState<PeriodRemarkModel[]>([]);

  const remarkMutation = api.periodRemark.getPeriodRemarkList.useMutation({
    onSuccess: (resp) => setRemarkList(resp.remarks)
  });

  // update list when search criterias change
  useEffect(() => {
    remarkMutation.mutate({
      studentId: studentId ?? ""
    });
  }, [studentId, isFocused]);

  return (
    <Body>
      {remarkMutation.isLoading && <ProgressBar indeterminate visible={true} />}

      <ScrollView>
        <View className={"space-y-3 p-2"}>
          {remarkList.map((item, key) => (
            <View key={key}>
              <PeriodRemarkItem item={item} isTeacher={false} time={moment()} />
            </View>
          ))}
        </View>
      </ScrollView>
    </Body>
  );
};

export default PeriodRemarkScreen;
