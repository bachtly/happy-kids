import { useRouter, useSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuthContext } from "../../src/utils/auth-context-provider";
import CustomStackScreen from "../../src/components/CustomStackScreen";
import FeatureItem from "../../src/components/home/FeatureItem";
import attIcon from "../../assets/images/attendance.png";
import studyIcon from "../../assets/images/study.png";
import menuIcon from "../../assets/images/menu.png";
import remarkIcon from "../../assets/images/remark.png";
import albumIcon from "../../assets/images/album.png";
import noteIcon from "../../assets/images/note.png";
import medIcon from "../../assets/images/medicine-icon.png";
import leaveIcon from "../../assets/images/leave-letter-icon.png";
import pickupIcon from "../../assets/images/pickup-icon.png";
import tuitionIcon from "../../assets/images/tuition.png";
import feedbackIcon from "../../assets/images/feedback.png";
import Body from "../../src/components/Body";

const TeacherHomeScreen = () => {
  const { onLogout } = useAuthContext();
  const router = useRouter();

  const { classId } = useSearchParams();

  return (
    <Body>
      <CustomStackScreen title={"Trang chủ"} />

      <ScrollView>
        <View className={"space-y-6 p-4"}>
          {/*GROUP FEATURES*/}
          <View className={"space-y-4"}>
            <Text variant={"titleLarge"}>Hoạt động của trẻ</Text>

            <View className={"flex-row justify-start"}>
              <FeatureItem
                title={"Điểm danh"}
                icon={attIcon}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/attendance",
                    params: { classId }
                  })
                }
              />
              <FeatureItem title={"Học tập"} icon={studyIcon} />
              <FeatureItem title={"Thực đơn"} icon={menuIcon} />
              <FeatureItem
                title={"Nhận xét"}
                icon={remarkIcon}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/remark/remark-home-screen",
                    params: { classId }
                  })
                }
              />
            </View>

            <View className={"flex-row justify-start"}>
              <FeatureItem title={"Album ảnh"} icon={albumIcon} />
            </View>
          </View>

          {/*GROUP FEATURES*/}
          <View className={"space-y-4"}>
            <Text variant={"titleLarge"}>Tương tác với phụ huynh</Text>

            <View className={"flex-row justify-start"}>
              <FeatureItem title={"Lời nhắn"} icon={noteIcon} />
              <FeatureItem
                title={"Dặn thuốc"}
                icon={medIcon}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/medicine/medicine-home-screen",
                    params: { classId }
                  })
                }
              />
              <FeatureItem
                title={"Xin nghỉ"}
                icon={leaveIcon}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/leaveletter/leaveletter-home-screen",
                    params: { classId }
                  })
                }
              />
              <FeatureItem
                title={"Đón về"}
                icon={pickupIcon}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/pickup/history-screen",
                    params: { classId }
                  })
                }
              />
            </View>
          </View>

          {/*GROUP FEATURES*/}
          <View className={"space-y-4"}>
            <Text variant={"titleLarge"}>Tương tác với nhà trường</Text>

            <View className={"flex-row justify-start"}>
              <FeatureItem title={"Tiền lương"} icon={tuitionIcon} />
              <FeatureItem title={"Góp ý"} icon={feedbackIcon} />
            </View>
          </View>
        </View>

        <Button onPress={() => onLogout()}>LOGOUT</Button>
      </ScrollView>
    </Body>
  );
};

export default TeacherHomeScreen;
