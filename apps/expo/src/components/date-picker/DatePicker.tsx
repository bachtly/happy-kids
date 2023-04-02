import { Moment } from "moment";
import { useState } from "react";
import { Pressable, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

interface DatePickerProps {
  // React State passed from outside
  initTime: Moment | null;
  setTime: (date: Moment) => void;
}

const DatePicker = (props: DatePickerProps) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [time, setTime] = useState<Moment | null>(null);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const onSelectDate = (date: Moment) => {
    setTime(date);
  };

  const onCloseModel = () => {
    if (time == null) {
      // prevent partial select, restore selection if available
      setTime(props.initTime);
    } else {
      props.setTime(time);
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
                onDateChange={(date) => onSelectDate(date)}
                allowRangeSelection={false}
                width={320} // This need to be recalculated relatively by screen width
                initialDate={time?.toDate() ?? undefined}
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
        </Dialog>
      </Portal>

      <Pressable className={"flex-row space-x-2"} onPress={() => showDialog()}>
        <View className={""}>
          <FontAwesomeIcon name="calendar" size={25} />
        </View>
        <View className={" m-auto flex-row"}>
          <View>
            <Text className={"m-auto"}>
              {props.initTime?.format("DD/MM/YYYY").toString() ?? "__/__/____"}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default DatePicker;
