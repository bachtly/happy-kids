import DateTimePicker, {
  DateTimePickerEvent
} from "@react-native-community/datetimepicker";
import moment, { Moment } from "moment";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import Icons from "react-native-vector-icons/FontAwesome5";

interface TimePickerProps {
  // React State passed from outside
  time: Moment | null;
  setTime: (date: Moment | null) => void;
}

const TimePicker = (props: TimePickerProps) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = React.useState(false);
  const [time, setTime] = React.useState<Date | undefined>(
    (props.time && props.time.toDate()) ?? undefined
  );

  const handleTimeSelected = (
    event: DateTimePickerEvent,
    selectedTime: Date | undefined
  ) => {
    setShowPicker(false);
    if (event.type == "set") {
      if (selectedTime) {
        setTime(selectedTime);
        props.setTime(moment(selectedTime));
      }
    }
  };

  const handlePress = () => setShowPicker(true);

  return (
    <View>
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <View className={"flex-row"}>
            <View className={"mb-1 ml-0 mr-2 flex-initial"}>
              <Icons name="clock" size={25} />
            </View>
            <View
              style={{
                borderColor: theme.colors.primary,
                borderBottomWidth: pressed ? 1 : 0
              }}
            >
              <Text className={"m-auto mb-1"}>
                {(props.time && props.time.format("HH:mm").toString()) ??
                  "__:__"}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
      {showPicker && (
        <DateTimePicker
          testID="timePicker"
          value={time ?? new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeSelected}
        />
      )}
    </View>
  );
};

export default TimePicker;
