import { Moment } from "moment";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Modal, Portal } from "react-native-paper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

interface DatePickerProps {
  // React State passed from outside
  initTimeStart: Moment | null;
  initTimeEnd: Moment | null;
  setTimeStart: (date: Moment | null) => void;
  setTimeEnd: (date: Moment | null) => void;
  useRange: boolean;
}

const DatePicker = (props: DatePickerProps) => {
  const [modelVisible, setModelVisible] = useState(false);
  const [timeStart, setTimeStart] = useState<Moment | null>(null);
  const [timeEnd, setTimeEnd] = useState<Moment | null>(null);

  const onSelectDate = (date: Moment) => {
    if (timeStart == null || timeEnd != null) {
      setTimeStart(date);
      setTimeEnd(null);
    } else {
      setTimeEnd(date);
    }
  };

  const onShowModel = () => {
    setTimeStart(null);
    setTimeEnd(null);
  };

  const onCloseModel = () => {
    if (timeStart == null || timeEnd == null) {
      // prevent partial select, restore selection if available
      setTimeStart(props.initTimeStart);
      setTimeEnd(props.initTimeEnd);
    } else {
      props.setTimeStart(timeStart);
      props.setTimeEnd(timeEnd);
      props.initTimeStart = timeStart;
      props.initTimeEnd = timeEnd;
    }

    setModelVisible(false);
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={modelVisible}
          onDismiss={() => onCloseModel()}
          style={{
            alignItems: "center"
          }}
        >
          <View className={"bg-white p-2"}>
            <CalendarPicker
              onDateChange={(date) => onSelectDate(date)}
              allowRangeSelection={props.useRange}
              // height={400}
              width={320}
            />
          </View>
        </Modal>
      </Portal>
      <Pressable className={"flex-row"} onPress={() => setModelVisible(true)}>
        <View className={"flex-row border-b-2 border-b-cyan-400"}>
          <View className={" flex-row "}>
            <View>
              <Text className={"m-auto mb-1"}>
                {props.initTimeStart?.format("DD/MM/YYYY").toString() ??
                  "__/__/____"}
              </Text>
            </View>
            <View>
              <Text className={"m-auto mb-1"}> - </Text>
            </View>
            <View>
              <Text className={"m-auto mb-1"}>
                {props.initTimeEnd?.format("DD/MM/YYYY").toString() ??
                  "__/__/____"}
              </Text>
            </View>
          </View>
          <View className={"m-1 ml-2 flex-initial"}>
            <FontAwesomeIcon name="calendar" size={25} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default DatePicker;
