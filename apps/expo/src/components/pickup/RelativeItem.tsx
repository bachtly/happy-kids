import { View } from "react-native";
import { Card, Text, Avatar, useTheme } from "react-native-paper";
import { RelativeModel } from "../../models/PickupModels";

const RelativeItem = ({
  item,
  selected
}: {
  item: RelativeModel;
  selected: boolean;
}) => {
  const { colors } = useTheme();

  return (
    <Card
      mode={selected ? "outlined" : "contained"}
      style={{ backgroundColor: colors.background }}
    >
      <Card.Content>
        <View className={"flex-row space-x-3"}>
          <Avatar.Image
            className={"my-auto"}
            size={42}
            source={{
              uri: item.avatar ? `data:image/jpeg;base64,${item.avatar}` : ""
            }}
          />
          <View>
            <Text className={""} variant={"titleSmall"}>
              {item.fullname}
            </Text>
            <Text className={"italic"} variant={"bodyMedium"}>
              {item.phone}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default RelativeItem;
