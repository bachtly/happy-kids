import {
  FlatList,
  RefreshControl,
  View,
  Image,
  ScrollView,
  TouchableHighlight
} from "react-native";
import React, { useState } from "react";
import { useSearchParams } from "expo-router";
import { Chip, Divider, Portal, Text } from "react-native-paper";
import ImageView from "react-native-image-viewing";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import LoadingBar from "../../components/common/LoadingBar";
import Body from "../../components/Body";
import AlertModal from "../../components/common/AlertModal";
import CustomStackScreen from "../../components/CustomStackScreen";
import { api } from "../../utils/api";
import AlbumHead from "../../components/album/AlbumHead";
import { UserChatModel } from "../../models/AlbumModels";
import AlbumIcon from "assets/images/album.png";

const AlbumDetail = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [albumHead, setAlbumHead] = useState<UserChatModel>({
    avatar: "",
    name: "User"
  });

  const { id } = useSearchParams();

  const [photoList, setPhotoList] = useState<string[]>([]);
  const [imgVisible, setImgVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const { refetch, isFetching } = api.album.getAlbum.useQuery(
    {
      albumId: id ?? ""
    },
    {
      onSuccess: (data) => {
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setPhotoList(data.photos);
        setTopics(data.topics.filter((item): item is string => item !== null));
        setEventDate(data.eventDate);
        setAlbumHead(data.teacher);
      },
      enabled: !!id,
      onError: (e) => setErrorMessage(e.message)
    }
  );

  const fetchData = () => {
    if (id)
      refetch().catch((e: Error) => {
        console.log(e);
      });
  };

  return (
    <Body>
      <CustomStackScreen title={"Chi tiết album"} />
      <LoadingBar isFetching={isFetching} />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <View className="p-3 pb-0">
          <AlbumHead user={albumHead} eventDate={eventDate} />
          <Text className="mt-2" variant={"bodyMedium"}>
            <FontAwesome5Icon color={"#111"} name="images" /> Album:{" "}
            <Text className="font-bold" variant={"bodyMedium"}>
              {title}
            </Text>
          </Text>
          <Text variant={"bodyMedium"}>{description}</Text>
          <Divider className="mt-2" />
          {topics.length > 0 && (
            <View className="mt-2">
              <View className={"mb-2 flex flex-row flex-wrap gap-1"}>
                {topics.map((item, index) => (
                  <Chip mode="outlined" key={index}>
                    <Text className="capitalize" variant="labelSmall">
                      {item}
                    </Text>
                  </Chip>
                ))}
              </View>
              <Divider />
            </View>
          )}
        </View>

        <FlatList
          contentContainerStyle={{ padding: 4 }}
          data={photoList}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <ImageItem
              item={item}
              onPress={() => {
                setImgIdx(index);
                setImgVisible(true);
              }}
            />
          )}
          scrollEnabled={false}
        />
      </ScrollView>

      <Portal>
        <ImageView
          images={photoList.map((item) => ({
            uri: `data:image/jpeg;base64,${item}`
          }))}
          keyExtractor={(_, index) => String(index)}
          imageIndex={imgIdx}
          visible={imgVisible}
          onRequestClose={() => setImgVisible(false)}
        />
      </Portal>

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default AlbumDetail;

const ImageItem = ({
  item,
  onPress
}: {
  item: string;
  onPress: () => void;
}) => {
  return (
    <View className="flex-1 p-1">
      <TouchableHighlight className="aspect-square" onPress={onPress}>
        <Image
          source={
            item === "" ? AlbumIcon : { uri: `data:image/jpeg;base64,${item}` }
          }
          className={"h-full w-full"}
        />
      </TouchableHighlight>
    </View>
  );
};
