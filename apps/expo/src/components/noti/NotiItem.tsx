import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import moment from "moment/moment";
import CustomCard from "../CustomCard";
import { NotiItemModel } from "../../models/NotiModels";
import notiIcon from "assets/images/noti-icon.png";

const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

const NotiItem = ({ item }: { item: NotiItemModel }) => {
  const router = useRouter();
  const route = JSON.parse(item.route ?? "") as {
    pathname?: string;
    params?: Record<string, any>;
  };

  return (
    <View>
      <CustomCard
        onPress={() => {
          router.push(route);
        }}
      >
        <View className={"flex-row space-x-2"}>
          <Image
            className={"my-auto aspect-square w-16"}
            source={
              item.photo && item.photo != ""
                ? { uri: `data:image/jpeg;base64,${item.photo ?? ""}` }
                : notiIcon
            }
          />

          <View className={"flex-1 space-y-1"}>
            <Text variant={"labelLarge"} className={""}>
              {item.title}
            </Text>

            <Text className={""}>{item.content}</Text>

            {item.time && (
              <Text className={"text-right"}>
                {moment(item.time).format(DATETIME_FORMAT).toString()}
              </Text>
            )}
          </View>
        </View>
      </CustomCard>
    </View>
  );
};

export default NotiItem;
