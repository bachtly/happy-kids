import React, { FC, useContext, useEffect, useState } from "react";
import { ScrollView, Pressable, View } from "react-native";
import { Button, Checkbox, Text, Searchbar, Divider } from "react-native-paper";
import RNModal from "react-native-modal";

import { api } from "../../utils/api";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import { ErrorContext } from "../../utils/error-context";
import { useAuthContext } from "../../utils/auth-context-provider";
import { AlbumTopic } from "../../models/AlbumModels";

interface PropsType {
  visibleParent: boolean;
  visible: boolean;
  close: () => void;
  topics: AlbumTopic[];
  setTopics: React.Dispatch<React.SetStateAction<AlbumTopic[]>>;
}

const AlbumTopicModal: FC<PropsType> = (props) => {
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const { visible, close } = props;

  const [topicList, setTopicList] = useState<AlbumTopic[]>([]);
  const [checkedTopics, setCheckedTopics] = useState<Set<string>>(new Set());

  const [curTopic, setCurTopic] = useState("");
  const [displayTopics, setDisplayTopics] = useState<AlbumTopic[]>([]);
  const [displayCheckedTopics, setCheckedDisplayTopics] = useState<
    AlbumTopic[]
  >([]);

  const { refetch } = api.album.getAlbumTopic.useQuery(undefined, {
    onSuccess: (data) => {
      setTopicList(
        data.map((item) => ({ id: item.id, topic: item.topic ?? "" }))
      );
    },
    enabled: false,
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const topicMutation = api.album.insertAlbumTopic.useMutation({
    onSuccess: (data) => {
      addAlbumTopic(data.albumTopicId);
      void refetch();
      setCurTopic("");
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const resetFields = () => {
    setTopicList([]);
    setCheckedTopics(new Set());
    setCheckedDisplayTopics([]);
    setDisplayTopics([]);
  };

  useEffect(() => {
    if (visible) {
      void refetch();
    }
  }, [visible]);

  useEffect(() => {
    setDisplayTopics(
      topicList.filter(
        (item) =>
          !checkedTopics.has(item.id) &&
          item.topic.toLowerCase().includes(curTopic.toLowerCase())
      )
    );
    setCheckedDisplayTopics(
      topicList.filter((item) => checkedTopics.has(item.id))
    );
  }, [topicList, curTopic]);

  useEffect(() => {
    if (props.visibleParent) {
      resetFields();
    }
  }, [props.visibleParent]);

  const addAlbumTopic = (albumTopicId: string) => {
    setCheckedTopics((prev) => {
      const re = new Set(prev);
      if (re.delete(albumTopicId)) return re;
      else return re.add(albumTopicId);
    });
  };

  return (
    <RNModal
      className="m-0"
      isVisible={visible}
      hasBackdrop={false}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
    >
      <View className={"h-full bg-white pb-1"}>
        <Searchbar
          className={"w-full"}
          placeholder="Tìm kiếm chủ đề"
          value={curTopic}
          onChangeText={setCurTopic}
        />
        <Divider />
        <ScrollView
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 20
          }}
        >
          {displayCheckedTopics.length > 0 && (
            <Text variant="labelLarge" className="mb-1">
              Chủ đề đã chọn
            </Text>
          )}
          {displayCheckedTopics.map((item) => (
            <Pressable
              className={"mb-1"}
              onPress={() => {
                addAlbumTopic(item.id);
              }}
              key={item.id}
            >
              <TopicItem
                topic={item.topic}
                checked={checkedTopics.has(item.id)}
              />
            </Pressable>
          ))}
          {displayTopics.length > 0 && (
            <Text variant="labelLarge" className="mb-1">
              Danh sách chủ đề
            </Text>
          )}
          {displayTopics.map((item) => (
            <Pressable
              className={"mb-1"}
              onPress={() => {
                addAlbumTopic(item.id);
              }}
              key={item.id}
            >
              <TopicItem
                topic={item.topic}
                checked={checkedTopics.has(item.id)}
              />
            </Pressable>
          ))}
        </ScrollView>

        {curTopic.length > 0 && (
          <Button
            mode="outlined"
            onPress={() => {
              topicMutation.mutate({ topic: curTopic });
            }}
          >
            Thêm chủ đề {curTopic}
          </Button>
        )}
        <View className="flex flex-row items-center justify-evenly">
          <Button mode={"outlined"} className="w-1/2" onPress={close}>
            Hủy
          </Button>
          <Button
            mode={"contained"}
            className="w-1/2"
            onPress={() => {
              props.setTopics(
                topicList.filter((item) => checkedTopics.has(item.id))
              );
              close();
            }}
          >
            Lưu
          </Button>
        </View>
      </View>
    </RNModal>
  );
};

export default AlbumTopicModal;

const TopicItem = (props: { topic: string; checked: boolean }) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text>{props.topic}</Text>
      <Checkbox status={props.checked ? "checked" : "unchecked"} />
    </View>
  );
};
