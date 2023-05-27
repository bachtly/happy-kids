import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";

import { UserChatModel } from "../../models/AlbumModels";

const AlbumHead = (props: { user: UserChatModel; eventDate: Date | null }) => {
  return (
    <View className="flex flex-row items-center">
      {props.user.avatar !== "" ? (
        <Avatar.Image
          source={{
            uri: `data:image/jpeg;base64,${props.user.avatar}`
          }}
          size={46}
        />
      ) : (
        <Avatar.Text label={props.user.name[0]} size={46} />
      )}
      <View className="ml-2">
        <Text className="font-extrabold" variant="bodyMedium">
          {props.user.name}
        </Text>
        <Text className="text-gray-500" variant="bodySmall">
          {props.eventDate?.toDateString() ?? "__/__/____"}
        </Text>
      </View>
    </View>
  );
};

export default AlbumHead;
