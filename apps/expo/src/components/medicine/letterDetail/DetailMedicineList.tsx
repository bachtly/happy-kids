import React from "react";
import { FlatList, Image, View } from "react-native";
import { Text } from "react-native-paper";
import medicineIcon from "../../../../assets/images/medicine-icon.png";
import CustomCard from "../../CustomCard";
import SingleImageView from "../../common/SingleImageView";
export type Item = {
  id: string;
  name: string;
  amount: string;
  photo: string;
};

type ItemListProps = {
  items: Item[];
};

export default function DetailMedicineList({
  items
}: ItemListProps): React.ReactElement {
  const renderItem = ({ item }: { item: Item }) => (
    <CustomCard mode={"outlined"}>
      <View className={"flex-row justify-between"}>
        {item.photo !== "" ? (
          <View className={"aspect-square w-1/3"}>
            <SingleImageView image={item.photo} />
          </View>
        ) : (
          <View className={"aspect-square w-1/3 items-center justify-center "}>
            <Image className={"h-16 w-16"} source={medicineIcon} />
          </View>
        )}
        <View className={"w-2/3 flex-col justify-between "}>
          <View className={"gap-y-1 pl-3"}>
            <Text variant={"bodyMedium"}>Thuốc {item.name} </Text>
            <Text variant={"bodyMedium"}>{item.amount} </Text>
          </View>
        </View>
      </View>
    </CustomCard>
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
