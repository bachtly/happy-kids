import React from "react";
import { FlatList, Image, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import medicineIcon from "../../../../assets/images/medicine-icon.png";

export type Item = {
  id: string;
  name: string;
  amount: string;
  photo: string;

  onModify: () => void;
  onDelete: () => void;
};

type ItemListProps = {
  items: Item[];
};

export default function MedicineList({
  items
}: ItemListProps): React.ReactElement {
  const theme = useTheme();
  const renderItem = ({ item }: { item: Item }) => (
    <Card
      mode={"outlined"}
      style={{ backgroundColor: theme.colors.background, borderRadius: 2 }}
    >
      <Card.Content>
        <View className={"flex-row justify-between"}>
          {item.photo !== "" ? (
            <Image
              className={"aspect-square w-1/3"}
              source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
            />
          ) : (
            <View
              className={"aspect-square w-1/3 items-center justify-center "}
            >
              <Image className={"h-16 w-16"} source={medicineIcon} />
            </View>
          )}
          <View className={"w-2/3 flex-col justify-between "}>
            <View className={"gap-y-1 pl-3"}>
              <Text variant={"bodyMedium"}>Thuốc {item.name} </Text>
              <Text variant={"bodyMedium"}>{item.amount} </Text>
            </View>
            <View
              className={"flex flex-row justify-end"}
              style={{ marginRight: -5, marginBottom: -10 }}
            >
              <IconButton
                icon={"pencil"}
                iconColor={theme.colors.primary}
                containerColor={theme.colors.background}
                size={16}
                mode={"contained"}
                onPress={() => {
                  item.onModify();
                }}
              />

              <IconButton
                icon={"delete"}
                iconColor={theme.colors.error}
                containerColor={theme.colors.background}
                size={16}
                onPress={() => {
                  item.onDelete();
                }}
              />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      contentContainerStyle={{ gap: 8 }}
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
}
