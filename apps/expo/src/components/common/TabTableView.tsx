import { View, ScrollView } from "react-native";
import { useTheme, Button } from "react-native-paper";
import CustomCard from "../CustomCard";

interface TabButtonProps {
  text: string;
  onPress: () => void;
}

interface TabTableViewProps {
  tabButtonPropsList: TabButtonProps[];
  chosenIndex: number;
  children: React.ReactNode;
  tabButtonAdd?: () => void;
}

export default function TabTableView(props: TabTableViewProps) {
  const theme = useTheme();
  return (
    <View className="rounded-sm">
      <ScrollView
        contentContainerStyle={{
          borderWidth: 1,
          borderBottomWidth: 0,
          borderColor: theme.colors.outline
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {props.tabButtonPropsList.map((item, index) => (
          <View key={index}>
            <Button
              mode={"elevated"}
              style={
                index == props.chosenIndex
                  ? {
                      borderWidth: 0,
                      borderRadius: 0,
                      backgroundColor: theme.colors.background
                    }
                  : {
                      borderWidth: 0,
                      borderRadius: 0
                    }
              }
              onPress={item.onPress}
            >
              {item.text}
            </Button>
          </View>
        ))}
        {props.tabButtonAdd && (
          <Button
            mode={"elevated"}
            style={{
              borderWidth: 0,
              borderRadius: 0
            }}
            onPress={props.tabButtonAdd}
          >
            +
          </Button>
        )}
      </ScrollView>

      <CustomCard>{props.children}</CustomCard>
    </View>
  );
}
