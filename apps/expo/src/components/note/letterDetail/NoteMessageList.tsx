import React, { useState } from "react";
import { FlatList } from "react-native";
import { NoteMessage } from "../../../models/NoteModels";
import MessageItem from "./MessageItem";

type ItemListProps = {
  items: NoteMessage[];
  userId: string;
};

export function NoteMessageList({
  items,
  userId
}: ItemListProps): React.ReactElement {
  const [curShowTime, setCurShowTime] = useState("");

  const renderItem = ({ item }: { item: NoteMessage }) => {
    return (
      <MessageItem
        isRight={item.sendUserId === userId}
        item={item}
        showTime={curShowTime === item.id}
        onPress={() => {
          if (curShowTime === item.id) setCurShowTime("");
          else setCurShowTime(item.id);
        }}
      />
    );
  };
  const compressedItems = items.map((item, index) => {
    if (index > 0 && items[index - 1].sendUserId == item.sendUserId)
      return { ...item, sendUser: "" };
    return item;
  });
  return (
    <FlatList
      contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
      data={compressedItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
}
