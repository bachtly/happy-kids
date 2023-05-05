import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { PeriodRemarkModel } from "../../../src/models/PeriodRemarkModels";
import PeriodRemarkItem from "../../../src/components/remark/PeriodRemarkItem";
import Body from "../../../src/components/Body";
import DateFilterBar from "../../../src/components/date-picker/DateFilterBar";
import moment, { Moment } from "moment/moment";
import { api } from "../../../src/utils/api";
import AlertModal from "../../../src/components/common/AlertModal";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { ErrorContext } from "../../../src/utils/error-context";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import LoadingBar from "../../../src/components/common/LoadingBar";

const DEFAULT_TIME = moment(moment.now());

const PeriodRemarkScreen = ({ classId }: { classId: string }) => {
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [remarkList, setRemarkList] = useState<PeriodRemarkModel[]>([]);

  const [time, setTime] = useState<Moment>(DEFAULT_TIME);
  const [errorMessage, setErrorMessage] = useState("");

  const remarkMutation =
    api.periodRemark.getPeriodRemarkListFromClassId.useMutation({
      onSuccess: (resp) => setRemarkList(resp.remarks),
      onError: ({ message, data }) =>
        trpcErrorHandler(() => {})(
          data?.code ?? "",
          message,
          errorContext,
          authContext
        )
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
      <LoadingBar isFetching={remarkMutation.isLoading} />

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

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default PeriodRemarkScreen;
