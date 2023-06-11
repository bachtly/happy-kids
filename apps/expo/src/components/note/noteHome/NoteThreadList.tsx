import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { FlatList, Image, View } from "react-native";
import { Text } from "react-native-paper";
import noteIcon from "../../../../assets/images/note.png";
import CustomCard from "../../CustomCard";
import { NoteThread } from "../../../models/NoteModels";
import LetterStatusText from "../../medicine/StatusText";

type ItemListProps = {
  items: NoteThread[];
  isTeacher: boolean;
  onRefresh: () => void;
  refreshing: boolean;
};

export function NoteThreadList({
  items,
  isTeacher,
  onRefresh,
  refreshing
}: ItemListProps): React.ReactElement {
  const router = useRouter();
  const renderItem = ({ item }: { item: NoteThread }) => {
    const toDateString = (date: Date | null) =>
      date ? moment(date).format("DD/MM/YYYY") : "__/__/____";
    const startDate = toDateString(item.startDate);
    const endDate = toDateString(item.endDate);
    const createdAt = toDateString(item.createdAt);
    return (
      <CustomCard
        onPress={() => {
          router.push({
            pathname: `${
              isTeacher ? "teacher" : "parent"
            }/note/letter-detail-screen`,
            params: { id: item.id, studentName: item.studentName }
          });
        }}
      >
        <Text variant={"labelLarge"} className={"mb-2"}>
          Lời nhắn {`cho bé ${item.studentName} `}
          <Text className={""}>
            ({startDate}
            {startDate !== startDate ? "" : ` đến ${endDate}`})
          </Text>{" "}
        </Text>
        <View className={"flex flex-row justify-between gap-x-4 "}>
          <Image className={"aspect-square w-1/6"} source={noteIcon} />
          <View
            className={
              "flex-shrink flex-grow flex-col gap-y-1 whitespace-nowrap"
            }
          >
            <Text
              variant={"bodyMedium"}
              numberOfLines={1}
              className="overflow-hidden"
            >
              {item.content}
            </Text>
            <Text variant={"bodyMedium"} className={""}>
              Ngày tạo: {createdAt}
            </Text>
            <LetterStatusText status={item.status} />
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}
