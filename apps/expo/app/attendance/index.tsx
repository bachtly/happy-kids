import { Moment } from "moment";
import { useState } from "react";
import { View } from "react-native";
import DatePicker from "../../src/components/DatePicker";

const AttendanceHome = () => {
  const [timeStart, setTimeStart] = useState<Moment | null>(null);
  const [timeEnd, setTimeEnd] = useState<Moment | null>(null);

  return (
    <View>
      <View className={"m-1 bg-white p-2"}>
        <DatePicker
          initTimeStart={(() => timeStart)()}
          initTimeEnd={(() => timeEnd)()}
          setTimeStart={setTimeStart}
          setTimeEnd={setTimeEnd}
          useRange={true}
        />
      </View>
    </View>
  );
};

export default AttendanceHome;
