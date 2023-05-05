import moment, { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { List, ProgressBar } from "react-native-paper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { AttendanceStatisticsModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { AttendanceContext } from "../../../../src/utils/attendance-context";
import DateRangeFilterBar from "../../../../src/components/date-picker/DateRangeFilterBar";
import Body from "../../../../src/components/Body";
import AlertModal from "../../../../src/components/common/AlertModal";
import { useIsFocused } from "@react-navigation/native";
import { trpcErrorHandler } from "../../../../src/utils/trpc-error-handler";
import { ErrorContext } from "../../../../src/utils/error-context";
import { useAuthContext } from "../../../../src/utils/auth-context-provider";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const StatisticsScreen = () => {
  // properties
  const { studentId } = React.useContext(AttendanceContext) ?? {
    studentId: null
  };
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  // states
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);
  const [errorMessage, setErrorMessage] = useState("");

  // data
  const [statistics, setStatistics] =
    useState<AttendanceStatisticsModel | null>(null);
  const attMutation = api.attendance.getAttendanceStatistics.useMutation({
    onSuccess: (resp) => setStatistics(resp.statistics),
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
    refresh();
  }, [timeStart, timeEnd, isFocused]);

  const refresh = () => {
    attMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  };

  return (
    <>
      <Body>
        {attMutation.isLoading && <ProgressBar indeterminate visible={true} />}
        <DateRangeFilterBar
          timeStart={timeStart}
          setTimeStart={setTimeStart}
          timeEnd={timeEnd}
          setTimeEnd={setTimeEnd}
        />

        <ScrollView>
          <List.Item
            title={`Đã điểm danh: ${
              (statistics?.CheckedIn as unknown as string) ?? "0"
            }`}
            // description="Item description"
            left={() => (
              <View className={"m-auto ml-5"}>
                <FontAwesomeIcon name={"circle"} size={15}></FontAwesomeIcon>
              </View>
            )}
          />
          <List.Item
            title={`Vắng có phép: ${
              (statistics?.AbsenseWithPermission as unknown as string) ?? "0"
            }`}
            // description="Item description"
            left={() => (
              <View className={"m-auto ml-5"}>
                <FontAwesomeIcon name={"circle"} size={15}></FontAwesomeIcon>
              </View>
            )}
          />
          <List.Item
            title={`Vắng không phép: ${
              (statistics?.AbsenseWithoutPermission as unknown as string) ?? "0"
            }`}
            // description="Item description"
            left={() => (
              <View className={"m-auto ml-5"}>
                <FontAwesomeIcon name={"circle"} size={15}></FontAwesomeIcon>
              </View>
            )}
          />
        </ScrollView>
      </Body>
      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default StatisticsScreen;
