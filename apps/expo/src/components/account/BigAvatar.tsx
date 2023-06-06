import { TouchableHighlight, View } from "react-native";
import ImageView from "react-native-image-viewing";
import { Avatar, IconButton, useTheme } from "react-native-paper";

import AvaImage from "../../../assets/images/default-user-avatar.png";
import { useState } from "react";

interface PropsType {
  image: string;
  onEditPress?: () => void;
}

const BigAvatar = ({ image, onEditPress }: PropsType) => {
  const theme = useTheme();
  const [imgVisible, setImgVisible] = useState(false);
  const src =
    image === "" ? AvaImage : { uri: `data:image/jpeg;base64,${image}` };
  return (
    <View className="relative mx-auto h-[100px] w-[100px]">
      <TouchableHighlight onPress={() => setImgVisible(true)}>
        <Avatar.Image size={100} source={src} className="absolute" />
      </TouchableHighlight>
      {onEditPress && (
        <IconButton
          className="absolute bottom-0 right-0 m-0 h-8 w-8"
          style={{ backgroundColor: theme.colors.primary }}
          iconColor="white"
          icon={"pencil"}
          mode="contained"
          onPress={onEditPress}
        />
      )}
      <ImageView
        images={[src]}
        keyExtractor={(_, index) => String(index)}
        imageIndex={0}
        visible={imgVisible}
        onRequestClose={() => setImgVisible(false)}
      />
    </View>
  );
};
export default BigAvatar;
