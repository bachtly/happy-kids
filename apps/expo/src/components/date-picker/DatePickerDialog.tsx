import { View } from "react-native";
import { Moment } from "moment";
import { useEffect, useState } from "react";
import CalendarPicker from "react-native-calendar-picker";
import { Button, Dialog, Portal } from "react-native-paper";

interface DatePickerDialogProps {
  // React State passed from outside
  initTime: Moment | null;
  setTime: (date: Moment | null) => void;
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
}

const DatePickerDialog = (props: DatePickerDialogProps) => {
  const { dialogVisible, setDialogVisible } = props;
  const [time, setTime] = useState<Moment | null>(null);

  const onCloseModel = () => {
    setDialogVisible(false);
  };

  const onSubmit = () => {
    if (time) {
      props.setTime(time);
    }
    onCloseModel();
  };

  useEffect(() => {
    if (dialogVisible) setTime(props.initTime);
  }, [dialogVisible]);

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
                onDateChange={(date) => setTime(date.startOf("day"))}
                allowRangeSelection={false}
                width={320} // This need to be recalculated relatively by screen width
                initialDate={props.initTime?.toDate()}
                selectedStartDate={time?.toDate()}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onSubmit}>Chọn ngày</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default DatePickerDialog;
