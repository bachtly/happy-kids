import { TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomButton = ({
  onPress,
  icon,
  text
}: {
  onPress: () => void;
  icon: string;
  text: string;
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      className="my-1 rounded-lg border border-slate-200 bg-white"
      underlayColor={"rgb(226, 232, 240)"}
    >
      <View className="relative flex flex-row items-center justify-between p-4">
        <Icon name={icon} size={20} />
        <Text className="ml-2 flex-1 text-left">{text}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default CustomButton;
