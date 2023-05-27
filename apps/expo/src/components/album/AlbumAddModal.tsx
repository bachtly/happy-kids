import moment, { Moment } from "moment";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Portal, Text, TextInput, Chip, IconButton } from "react-native-paper";
import RNModal from "react-native-modal";

import { AlbumTopic } from "../../models/AlbumModels";
import { api } from "../../utils/api";
import AlertModal from "../common/AlertModal";
import DatePickerTextInput from "../common/DatePickerTextInput";
import MultiImagePicker from "../common/MultiImagePicker";
import CustomStackScreenSend from "../CustomStackScreenSend";
import AlbumTopicModal from "./AlbumTopicModal";

interface PropsType {
  visible: boolean;
  onClose: () => void;
  fetchData: () => void;
  classId: string;
  studentId: string;
}

const AlbumAddModal = (props: PropsType) => {
  const { visible, onClose, classId } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [topics, setTopics] = useState<AlbumTopic[]>([]);
  const [eventDate, setEventDate] = useState<Moment | null>(moment());

  const [topicDgVis, setTopicDgVis] = useState(false);

  const [submitDisable, setSubmitDisable] = useState(false);

  const [submitFailed, setSubmitFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addMutation = api.album.insertAlbum.useMutation({
    onSuccess: (_) => {
      props.fetchData();
      closeModal();
    },
    onError: (e) => setErrorMessage(e.message),
    onSettled: () => setSubmitDisable(false)
  });

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setImageList([]);
    setSubmitDisable(false);
    setTopics([]);
  };

  const addAlbum = () => {
    if (!(title !== "") || !(description !== "")) {
      setSubmitFailed(true);
      return;
    }
    addMutation.mutate({
      title,
      description,
      photos: imageList,
      classId,
      eventDate: eventDate?.toDate() ?? new Date(),
      topics: topics.map((item) => item.id)
    });
    setSubmitDisable(true);
  };

  const closeModal = () => {
    setSubmitFailed(false);
    resetFields();
    onClose();
  };

  return (
    <>
      <Portal>
        {visible && (
          <CustomStackScreenSend
            title={"Tạo album"}
            sendButtonHandler={!submitDisable ? addAlbum : undefined}
            backButtonHandler={closeModal}
          />
        )}
        <RNModal
          className="m-0"
          isVisible={visible}
          coverScreen={false}
          hasBackdrop={false}
          hideModalContentWhileAnimating={true}
          animationIn={"slideInDown"}
          animationOut={"slideOutUp"}
          useNativeDriver={true}
        >
          <View className={"h-full bg-white"}>
            <ScrollView
              contentContainerStyle={{
                paddingVertical: 12,
                paddingHorizontal: 24
              }}
            >
              <View className="mb-2">
                <Text variant={"labelLarge"}>Tên album</Text>
                <TextInput
                  className={"text-sm"}
                  mode="outlined"
                  placeholder={"Nhập tên album"}
                  onChangeText={setTitle}
                  value={title}
                  error={submitFailed && title === ""}
                />
              </View>

              <View className="mb-2">
                <Text variant={"labelLarge"}>Ngày cho album</Text>
                <DatePickerTextInput
                  date={eventDate}
                  setDate={setEventDate}
                  textInputProps={{ placeholder: "Nhập ngày cho album" }}
                />
              </View>

              <View>
                <Text variant={"labelLarge"} className="mb-1">
                  Chủ đề
                </Text>
                <View className={"flex flex-row flex-wrap gap-1"}>
                  {topics.map((item) => (
                    <Chip mode="outlined" key={item.id}>
                      {item.topic}
                    </Chip>
                  ))}
                </View>
                <IconButton
                  mode="outlined"
                  onPress={() => setTopicDgVis(true)}
                  icon={"plus"}
                />
              </View>

              <View className="mb-2">
                <Text variant={"labelLarge"}>Mô tả</Text>
                <TextInput
                  className="text-sm"
                  mode="outlined"
                  placeholder={"Nhập mô tả"}
                  multiline
                  onChangeText={setDescription}
                  value={description}
                  error={submitFailed && description === ""}
                />
              </View>

              <View className="mb-2">
                <Text className="mb-2" variant={"labelLarge"}>
                  Ảnh
                </Text>
                <MultiImagePicker onImagesChange={setImageList} />
              </View>
            </ScrollView>
          </View>
        </RNModal>
      </Portal>

      <AlbumTopicModal
        visibleParent={visible}
        topics={topics}
        setTopics={setTopics}
        close={() => setTopicDgVis(false)}
        visible={topicDgVis}
      />
      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default AlbumAddModal;
