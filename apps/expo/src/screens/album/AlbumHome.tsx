import { FlatList, RefreshControl, ScrollView, View, Text } from "react-native";
import { useSearchParams } from "expo-router";
import React, { useState } from "react";
import { Chip, Divider } from "react-native-paper";

import LoadingBar from "../../components/common/LoadingBar";
import CustomStackScreen from "../../components/CustomStackScreen";
import AlertModal from "../../components/common/AlertModal";
import AlbumAddModal from "../../components/album/AlbumAddModal";
import AlbumItem from "../../components/album/AlbumItem";
import { AlbumItemModel, AlbumTopic } from "../../models/AlbumModels";
import { api } from "../../utils/api";

const AlbumHome = ({ isTeacher }: { isTeacher?: boolean }) => {
  const searchParams = useSearchParams();
  const [classId, _] = useState(searchParams.classId);
  const [studentId, __] = useState(searchParams.studentId);

  const [addModalVis, setAddModalVis] = useState(false);
  const [albumList, setAlbumList] = useState<AlbumItemModel[]>([]);
  const [selTopic, setSelTopic] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { refetch, isFetching } = api.album.getAlbumList.useQuery(
    {
      classId: classId ?? "",
      studentId: studentId ?? ""
    },
    {
      onSuccess: (data) => {
        setAlbumList(
          data.albums
            .sort((item1, item2) => {
              const createdI1 = item1.createdAt ? item1.createdAt.getTime() : 0;
              const createdI2 = item2.createdAt ? item2.createdAt.getTime() : 0;
              return createdI2 - createdI1;
            })
            .map((item) => ({
              title: item.title ?? "",
              description: item.description ?? "",
              photos: item.photos,
              id: item.id ?? "",
              eventDate: item.eventDate ?? new Date(),
              topics: item.topics,
              numPhoto: item.numPhoto,
              teacher: item.teacher
            }))
        );
      },
      enabled: !!classId || !!studentId,
      onError: (e) => setErrorMessage(e.message)
    }
  );

  const fetchData = () => {
    if (classId || studentId)
      refetch().catch((e: Error) => {
        console.log(e);
      });
  };

  return (
    <View className="flex-1 bg-gray-200">
      <CustomStackScreen
        title={"Album ảnh"}
        rightButtonHandler={isTeacher ? () => setAddModalVis(true) : undefined}
      />
      <LoadingBar isFetching={isFetching} />
      <AlbumFilterBar selTopic={selTopic} setSelTopic={setSelTopic} />
      <AlbumAddModal
        visible={addModalVis}
        onClose={() => setAddModalVis(false)}
        fetchData={fetchData}
        classId={classId ?? ""}
        studentId={studentId ?? ""}
      />

      <FlatList
        contentContainerStyle={{ rowGap: 8 }}
        data={
          selTopic === ""
            ? albumList
            : albumList.filter((item) =>
                item.topics.some((topic) => topic.id === selTopic)
              )
        }
        renderItem={({ item }: { item: AlbumItemModel }) => (
          <AlbumItem item={item} />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </View>
  );
};

export default AlbumHome;

const AlbumFilterBar = (props: {
  selTopic: string;
  setSelTopic: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [topics, setTopics] = useState<AlbumTopic[]>([]);

  api.album.getAlbumTopic.useQuery(undefined, {
    onSuccess: (data) => {
      setTopics(data.map((item) => ({ ...item, topic: item.topic ?? "" })));
    }
  });
  return (
    <View className={"fixed bg-white"}>
      <ScrollView
        horizontal
        contentContainerStyle={{ columnGap: 8, padding: 8 }}
        showsHorizontalScrollIndicator={false}
      >
        <Chip
          key={""}
          selected={props.selTopic === ""}
          onPress={() => props.setSelTopic("")}
        >
          Tất Cả Chủ Đề
        </Chip>
        {topics.map((item) => (
          <Chip
            key={item.id}
            selected={props.selTopic === item.id}
            onPress={() => props.setSelTopic(item.id)}
          >
            <Text className="capitalize">{item.topic}</Text>
          </Chip>
        ))}
      </ScrollView>
      <Divider />
    </View>
  );
};
