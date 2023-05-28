import { View, ScrollView } from "react-native";
import { useTheme, Button } from "react-native-paper";
import CustomCard from "../CustomCard";
import Ionicons from "react-native-vector-icons/Ionicons";

interface TabButtonProps {
  text: string;
  onPress: () => void;
}

interface TabTableViewProps {
  tabButtonPropsList: TabButtonProps[];
  chosenIndex: number;
  children: React.ReactNode;
  tabButtonAdd?: () => void;
  tabButtonRemove?: (index: number) => void;
}

export default function TabTableView(props: TabTableViewProps) {
  const theme = useTheme();
  return (
    <View className="rounded-sm">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
              labelStyle={
                index == props.chosenIndex
                  ? {
                      color: theme.colors.primary
                    }
                  : {
                      color: theme.colors.onSurfaceDisabled
                    }
              }
              onPress={item.onPress}
            >
              {item.text}
            </Button>

            {props.tabButtonRemove && (
              <Ionicons
                name={"remove-circle-outline"}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  color: theme.colors.onSurfaceDisabled
                }}
                size={18}
                onPress={() =>
                  props.tabButtonRemove && props.tabButtonRemove(index)
                }
              />
            )}
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
