import { Moment } from "moment";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

interface DatePickerProps {
  onChange: (date: Moment) => void;
}

const DatePicker = (props: DatePickerProps) => {
  const [modelVisible, setModelVisible] = useState(false);

  return (
    <View>
      <Modal
        visible={modelVisible}
        onRequestClose={() => setModelVisible(false)}
      >
        <View>
          <CalendarPicker onDateChange={(date) => props.onChange(date)} />
        </View>
      </Modal>
      <Pressable onPress={() => setModelVisible(true)}>
        <Text>FUNCKING PRESS</Text>
      </Pressable>
    </View>
  );
};

export default DatePicker;
