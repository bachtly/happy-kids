import {
  FlatList,
  RefreshControl,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import React, { useState } from "react";
import { useSearchParams } from "expo-router";
import { Card, Portal, Text } from "react-native-paper";
import ImageView from "react-native-image-viewing";

import LoadingBar from "../../components/common/LoadingBar";
import Body from "../../components/Body";
import AlertModal from "../../components/common/AlertModal";
import CustomStackScreen from "../../components/CustomStackScreen";
import AlbumIcon from "assets/images/album.png";

import { api } from "../../utils/api";

const ImageItem = ({
  item,
  onPress
}: {
  item: string;
  onPress: () => void;
}) => {
  return (
    <View className="max-w-[50%] flex-1 p-1">
      <TouchableOpacity className="aspect-square" onPress={onPress}>
        <Image
          source={
            item === "" ? AlbumIcon : { uri: `data:image/jpeg;base64,${item}` }
          }
          className={"h-full w-full"}
        />
      </TouchableOpacity>
    </View>
  );
};

const AlbumDetail = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
