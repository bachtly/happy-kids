import { View } from "react-native";
import { Avatar, IconButton, useTheme } from "react-native-paper";
import AvaImage from "../../../assets/images/default-user-avatar.png";

interface PropsType {
  image: string;
  onEditPress?: () => void;
}

const BigAvatar = ({ image, onEditPress }: PropsType) => {
  const theme = useTheme();
  return (
    <View className="relative mx-auto h-[100px] w-[100px]">
      <Avatar.Image
        size={100}
        source={
          image === "" ? AvaImage : { uri: `data:image/jpeg;base64,${image}` }
        }
        className="absolute"
      />
      {onEditPress && (
        <IconButton
          className="absolute right-0 bottom-0 m-0 h-8 w-8"
          style={{ backgroundColor: theme.colors.primary }}
          iconColor="white"
          icon={"pencil"}
          mode="contained"
          onPress={onEditPress}
        />
      )}
    </View>
  );
};
export default BigAvatar;
