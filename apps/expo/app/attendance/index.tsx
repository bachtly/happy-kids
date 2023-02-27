import { Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

const AttendanceHome = () => {
  return (
    <View>
      <Text>Attendance Home</Text>
      <CalendarPicker onDateChange={() => "HOHO"} allowRangeSelection={true} />
    </View>
  );
};

export default AttendanceHome;
