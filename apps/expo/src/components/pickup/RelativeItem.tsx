import { View } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { RelativeModel } from "../../models/PickupModels";
import CustomCard from "../CustomCard";

const RelativeItem = ({
  item,
  selected
}: {
  item: RelativeModel;
  selected: boolean;
}) => {
  return (
    <CustomCard mode={selected ? "outlined" : undefined}>
      <View className={"flex-row space-x-3"}>
        <Avatar.Image
          className={"my-auto"}
          size={42}
          source={{
            uri: item.avatar ? `data:image/jpeg;base64,${item.avatar}` : ""
          }}
        />
        <View>
          <Text className={""} variant={"labelLarge"}>
            {item.fullname}
          </Text>
          <Text className={""} variant={"bodyMedium"}>
            {item.phone}
          </Text>
        </View>
      </View>
    </CustomCard>
  );
};

export default RelativeItem;
