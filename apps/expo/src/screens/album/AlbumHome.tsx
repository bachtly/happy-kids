import { FlatList, RefreshControl, View } from "react-native";
import { useSearchParams } from "expo-router";
import React, { useState } from "react";

import Body from "../../components/Body";
import LoadingBar from "../../components/common/LoadingBar";
import CustomStackScreen from "../../components/CustomStackScreen";
import AlertModal from "../../components/common/AlertModal";
import AlbumAddModal from "../../components/album/AlbumAddModal";
import AlbumItem from "../../components/album/AlbumItem";

import { AlbumItemModel } from "../../models/AlbumModels";

import { api } from "../../utils/api";

const AlbumHome = ({ isTeacher }: { isTeacher?: boolean }) => {
  const searchParams = useSearchParams();
  const [classId, _] = useState(searchParams.classId);
  const [studentId, __] = useState(searchParams.studentId);

  const [addModalVis, setAddModalVis] = useState(false);
  const [albumList, setAlbumList] = useState<AlbumItemModel[]>([]);

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
              photo: item.photo ?? "",
              id: item.id ?? ""
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
    <Body>
      <LoadingBar isFetching={isFetching} />
      <View className="flex-1">
        <CustomStackScreen
          title={"Album ảnh"}
          addButtonHandler={isTeacher ? () => setAddModalVis(true) : undefined}
        />
        <FlatList
          numColumns={2}
          contentContainerStyle={{ padding: 4 }}
          data={albumList}
          renderItem={({ item }: { item: AlbumItemModel }) => (
            <AlbumItem item={item} />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={fetchData} />
          }
        />
      </View>

      <AlbumAddModal
        visible={addModalVis}
        onClose={() => setAddModalVis(false)}
        fetchData={fetchData}
        classId={classId ?? ""}
        studentId={studentId ?? ""}
      />
      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default AlbumHome;
