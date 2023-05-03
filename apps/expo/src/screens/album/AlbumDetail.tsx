import {
  FlatList,
  RefreshControl,
  View,
  Image,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import { useSearchParams } from "expo-router";
import { Card, Text } from "react-native-paper";

import LoadingBar from "../../components/common/LoadingBar";
import Body from "../../components/Body";
import AlertModal from "../../components/common/AlertModal";
import CustomStackScreen from "../../components/CustomStackScreen";
import AlbumIcon from "assets/images/album.png";

import { api } from "../../utils/api";

const ImageItem = ({ item }: { item: string }) => {
  return (
    <View className="max-w-[50%] flex-1 p-1">
      <View className="aspect-square bg-blue-300">
        <Image
          source={
            item === "" ? AlbumIcon : { uri: `data:image/jpeg;base64,${item}` }
          }
          className={"h-full w-full"}
        />
      </View>
    </View>
  );
};

const AlbumDetail = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useSearchParams();

  const [photoList, setPhotoList] = useState<string[]>([]);

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
        <Card className="p-3">
          <Text className="text-center" variant="titleMedium">
            {title}
          </Text>
          <Text className="text-center" variant="bodySmall">
            {description}
          </Text>
        </Card>

        <FlatList
          numColumns={2}
          contentContainerStyle={{ padding: 4 }}
          data={photoList}
          renderItem={({ item }: { item: string }) => <ImageItem item={item} />}
          scrollEnabled={false}
        />
      </ScrollView>

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
