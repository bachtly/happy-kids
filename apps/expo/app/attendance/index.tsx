import { Moment } from "moment";
import { useState } from "react";
import { Text, View } from "react-native";
import DateRangePicker from "../../src/components/DateRangePicker";

const AttendanceHome = () => {
  const [date, setDate] = useState<Moment | null>(null);

  return (
    <View>
      <Text>Attendance Home</Text>
      <Text>{date?.toString() ?? ""}</Text>
      <DateRangePicker onChange={(date) => setDate(date)} />
    </View>
  );
};

export default AttendanceHome;
