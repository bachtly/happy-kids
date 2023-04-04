import { View, ScrollView, RefreshControl } from "react-native";
import { ProgressBar, Text, useTheme } from "react-native-paper";

export default function ItemListWrapper({
  fetchData,
  isFetching,
  isEmpty,
  emptyPlaceHolderText,
  children
}: {
  fetchData: () => void;
  isFetching: boolean;
  isEmpty: boolean;
  emptyPlaceHolderText: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View className="flex-1">
      {isFetching && <ProgressBar indeterminate visible={true} />}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <View className="px-4 pt-4">
          {!isEmpty ? (
            children
          ) : (
            <View
              className="rounded-sm border p-4"
              style={{ borderColor: theme.colors.outline }}
            >
              <Text className={"text-center leading-6"}>
                {emptyPlaceHolderText}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
