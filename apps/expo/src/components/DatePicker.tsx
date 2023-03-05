import { Moment } from "moment";
import { useState } from "react";
import { Pressable, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

interface DatePickerProps {
  // React State passed from outside
  initTimeStart: Moment | null;
  initTimeEnd: Moment | null;
  setTimeStart: (date: Moment) => void;
  setTimeEnd: (date: Moment) => void;
  useRange: boolean;
}

const DatePicker = (props: DatePickerProps) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [timeStart, setTimeStart] = useState<Moment | null>(null);
  const [timeEnd, setTimeEnd] = useState<Moment | null>(null);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const onSelectDate = (date: Moment, type: "START_DATE" | "END_DATE") => {
    if (type == "START_DATE") {
      setTimeStart(date);
      setTimeEnd(null);
    } else {
      setTimeEnd(date);
    }
  };

  const onCloseModel = () => {
    if (timeStart == null || timeEnd == null) {
      // prevent partial select, restore selection if available
      setTimeStart(props.initTimeStart);
      setTimeEnd(props.initTimeEnd);
    } else {
      props.setTimeStart(timeStart);
      props.setTimeEnd(timeEnd);
    }

    setDialogVisible(false);
  };

  return (
    <View>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => onCloseModel()}
          style={{
            alignItems: "center",
            backgroundColor: "#fff"
          }}
        >
          <Dialog.Content className={"mt-0 p-0"}>
            <View className={"bg-whites"}>
              <CalendarPicker
                onDateChange={(date, type) => onSelectDate(date, type)}
                allowRangeSelection={props.useRange}
                width={320} // This need to be recalculated relatively by screen width
                initialDate={timeStart?.toDate() ?? undefined}
                selectedStartDate={timeStart?.toDate() ?? undefined}
                selectedEndDate={timeEnd?.toDate() ?? undefined}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialogVisible(false);
                onCloseModel();
              }}
            >
              Chọn ngày
            </Button>
          </Dialog.Actions>
          <View>
            <Text>{props.initTimeStart?.toString() ?? ""}</Text>
            <Text>{props.initTimeEnd?.toString() ?? ""}</Text>
            <Text>{timeStart?.toString() ?? ""}</Text>
            <Text>{timeEnd?.toString() ?? ""}</Text>
          </View>
        </Dialog>
      </Portal>

      <Pressable className={"flex-row space-x-2"} onPress={() => showDialog()}>
        <View className={""}>
          <FontAwesomeIcon name="calendar" size={25} />
        </View>
        <View className={" m-auto flex-row"}>
          <View>
            <Text className={"m-auto"}>
              {props.initTimeStart?.format("DD/MM/YYYY").toString() ??
                "__/__/____"}
            </Text>
          </View>
          <View>
            <Text className={"m-auto"}> - </Text>
          </View>
          <View>
            <Text className={"m-auto"}>
              {props.initTimeEnd?.format("DD/MM/YYYY").toString() ??
                "__/__/____"}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default DatePicker;
