import { Text, View } from "react-native";
import { Card } from "react-native-paper";

interface AttendanceItemProps {
  status: string | null;
  checkinNote: string | null;
  checkoutNote: string | null;
  date: Date | null;
}

const AttendanceItem = (props: AttendanceItemProps) => {
  return (
    <View>
      <Card style={{ marginBottom: 10 }}>
        <Card.Content>
          <Text>AttendanceItem</Text>
          {props.status ? <Text>status</Text> : <></>}
        </Card.Content>
      </Card>
    </View>
  );
};

export default AttendanceItem;
export type { AttendanceItemProps };
