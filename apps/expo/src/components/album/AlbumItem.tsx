import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { Card, Text } from "react-native-paper";

import { AlbumItemModel } from "../../models/AlbumModels";
import AlbumIcon from "assets/images/album.png";

const AlbumItem = ({ item }: { item: AlbumItemModel }) => {
  const router = useRouter();
  return (
    <View className="max-w-[50%] flex-1 p-1">
      <Card
        className="flex-1 space-y-1 p-3"
        onPress={() =>
          router.push({
            pathname: "parent/album/album-detail-screen",
            params: { id: item.id }
          })
        }
      >
        <View className=" aspect-square bg-blue-300">
          <Image
            source={
              item.photo === ""
                ? AlbumIcon
                : { uri: `data:image/jpeg;base64,${item.photo}` }
            }
            className={"h-full w-full"}
          />
        </View>
        <Text numberOfLines={1} variant={"labelLarge"}>
          {item.title}
        </Text>
        <Text numberOfLines={2} variant={"bodySmall"}>
          {item.description}
        </Text>
      </Card>
    </View>
  );
};

export default AlbumItem;
