import { useRouter } from "expo-router";
import { View, Image, Pressable } from "react-native";
import { Chip, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";

import AlbumHead from "./AlbumHead";
import { AlbumItemModel } from "../../models/AlbumModels";

const AlbumItem = ({ item }: { item: AlbumItemModel }) => {
  const router = useRouter();
  return (
    <View className="">
      <View className="bg-white p-3">
        <AlbumHead user={item.teacher} eventDate={item.eventDate} />
        <Text className="mt-2" variant={"bodyMedium"}>
          <Icon color={"#111"} name="images" /> Album:{" "}
          <Text className="font-bold" variant={"bodyMedium"}>
            {item.title}
          </Text>
        </Text>
        <Text variant={"bodyMedium"}>{item.description}</Text>
        <Pressable
          className="my-2 flex w-full flex-row"
          onPress={() =>
            router.push({
              pathname: "parent/album/album-detail-screen",
              params: { id: item.id }
            })
          }
        >
          <View
            className="aspect-square w-2/3 pr-0.5"
            style={item.numPhoto >= 3 ? {} : { width: "100%" }}
          >
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.photos[0]}` }}
              className="h-full w-full"
            />
          </View>
          {item.numPhoto >= 3 && (
            <View className="w-1/3">
              <View className="aspect-square w-full pb-0.5">
                <Image
                  source={{ uri: `data:image/jpeg;base64,${item.photos[1]}` }}
                  className="h-full w-full"
                />
              </View>
              <View className="relative aspect-square w-full">
                <Image
                  source={{ uri: `data:image/jpeg;base64,${item.photos[2]}` }}
                  className="absolute h-full w-full"
                />
                <View className="absolute flex h-full w-full items-center justify-center bg-[#00000088]">
                  <Text className="text-white" variant="labelLarge">
                    +{item.numPhoto - 2}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Pressable>

        {item.topics.length > 0 && (
          <View className="">
            <View className={"flex flex-row flex-wrap gap-1"}>
              {item.topics.map((item) => (
                <Chip mode="outlined" key={item.id}>
                  <Text variant="labelSmall" className="capitalize">
                    {item.topic}
                  </Text>
                </Chip>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default AlbumItem;
