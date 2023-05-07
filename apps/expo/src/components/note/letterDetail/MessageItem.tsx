import { View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { NoteMessage } from "../../../models/NoteModels";
import { Card } from "react-native-paper";
import moment from "moment";

const ChatContentCard = (props: {
  isRight: boolean;
  item: NoteMessage;
  onPress: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <Card
      style={{
        backgroundColor: props.isRight ? "#a0f0f0" : colors.background,
        borderRadius: 10
      }}
      onPress={props.onPress}
    >
      <Card.Content>
        <View style={{ margin: -4 }}>
          {props.item.sendUser !== "" && (
            <Text variant={"titleSmall"}>{props.item.sendUser}</Text>
          )}
          <Text variant={"bodyMedium"}>{props.item.content}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const MessageItem = ({
  item,
  isRight,
  showTime,
  onPress
}: {
  item: NoteMessage;
  isRight: boolean;
  showTime: boolean;
  onPress: () => void;
}) => {
  const Ava = () => {
    if (item.sendUser === "") return <View style={{ width: 36 }} />;
    return <Avatar.Text size={36} label={item.sendUser[0]} />;
  };
  return (
    <>
      <View
        className="flex-row"
        style={{
          justifyContent: isRight ? "flex-end" : "flex-start"
        }}
      >
        {!isRight && (
          <View className="mr-2">
            <Ava />
          </View>
        )}
        <View
          className="mx-1 flex-shrink"
          style={{ marginTop: item.sendUser === "" ? -8 : 0, maxWidth: "70%" }}
        >
          <ChatContentCard isRight={isRight} item={item} onPress={onPress} />
        </View>
        {isRight && (
          <View className="ml-2">
            <Ava />
          </View>
        )}
      </View>
      {showTime && (
        <Text variant="bodySmall" className="mt-2 text-center italic">
          {moment(item.sendTime).format("HH:mm - DD/MM")}
        </Text>
      )}
    </>
  );
};

export default MessageItem;
