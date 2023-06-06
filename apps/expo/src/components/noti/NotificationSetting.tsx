import CustomStackScreen from "../CustomStackScreen";
import React, { useContext, useEffect, useState } from "react";
import CustomTitle from "../common/CustomTitle";
import WhiteBody from "../WhiteBody";
import NotificationSettingItem from "./NotificationSettingItem";
import { RefreshControl, ScrollView, View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";

import attIcon from "assets/images/attendance.png";
import noteIcon from "assets/images/note.png";
import medIcon from "assets/images/medicine-icon.png";
import leaveIcon from "assets/images/leave-letter-icon.png";
import pickupIcon from "assets/images/pickup-icon.png";
import postIcon from "assets/images/post-icon.png";
import albumIcon from "assets/images/album.png";
import { api } from "../../utils/api";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import { useAuthContext } from "../../utils/auth-context-provider";
import { ErrorContext } from "../../utils/error-context";
import { NotificationTopics } from "../../models/NotiModels";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const NotificationSetting = () => {
  const theme = useTheme();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [attendance, setAttendance] = useState(true);
  const [medicineLetter, setMedicineLetter] = useState(true);
  const [leaveLetter, setLeaveLetter] = useState(true);
  const [noteLetter, setNoteLetter] = useState(true);
  const [pickupLetter, setPickupLetter] = useState(true);
  const [post, setPost] = useState(true);
  const [album, setAlbum] = useState(true);

  const getDisabledTopicsMutation = api.noti.getDisabledTopics.useMutation({
    onSuccess: (resp) => {
      resp.disabledTopics.map((topic) => {
        switch (topic) {
          case NotificationTopics.Attendance.toString():
            setAttendance(false);
            break;
          case NotificationTopics.MedicineLetter.toString():
            setMedicineLetter(false);
            break;
          case NotificationTopics.LeaveLetter.toString():
            setLeaveLetter(false);
            break;
          case NotificationTopics.NoteLetter.toString():
            setNoteLetter(false);
            break;
          case NotificationTopics.PickupLetter.toString():
            setPickupLetter(false);
            break;
          case NotificationTopics.Post.toString():
            setPost(false);
            break;
          case NotificationTopics.Album.toString():
            setAlbum(false);
            break;
        }
      });
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const updateDisabledTopics = api.noti.updateDisabledTopics.useMutation({
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  useEffect(() => {
    refresh();
  }, []);

  const updateNotificationSettings = () => {
    const disabledTopics = [];
    if (!attendance)
      disabledTopics.push(NotificationTopics.Attendance.toString());
    if (!medicineLetter)
      disabledTopics.push(NotificationTopics.MedicineLetter.toString());
    if (!leaveLetter)
      disabledTopics.push(NotificationTopics.LeaveLetter.toString());
    if (!noteLetter)
      disabledTopics.push(NotificationTopics.NoteLetter.toString());
    if (!pickupLetter)
      disabledTopics.push(NotificationTopics.PickupLetter.toString());
    if (!post) disabledTopics.push(NotificationTopics.Post.toString());
    if (!album) disabledTopics.push(NotificationTopics.Album.toString());

    updateDisabledTopics.mutate({
      disabledTopics: disabledTopics
    });
  };

  const refresh = () => {
    getDisabledTopicsMutation.mutate();
  };

  const isRefreshing = () => {
    return getDisabledTopicsMutation.isLoading;
  };

  return (
    <WhiteBody>
      <CustomStackScreen
        title={"Cài đặt thông báo"}
        headerRight={
          <TouchableRipple
            className="mt-1"
            borderless
            onPress={() => {
              updateNotificationSettings();
              router.back();
            }}
          >
            <Ionicons
              name="send-sharp"
              color={theme.colors.onPrimary}
              size={24}
            />
          </TouchableRipple>
        }
        rightButtonHandler={() => {}}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing()} onRefresh={refresh} />
        }
      >
        <CustomTitle title={"Danh sách tính năng"} />
        <View className={"px-3 pb-3"}>
          <NotificationSettingItem
            icon={attIcon}
            label={"Điểm danh"}
            state={attendance}
            setState={setAttendance}
          />

          <NotificationSettingItem
            icon={albumIcon}
            label={"Album"}
            state={album}
            setState={setAlbum}
          />

          <NotificationSettingItem
            icon={postIcon}
            label={"Bảng tin"}
            state={post}
            setState={setPost}
          />

          <NotificationSettingItem
            icon={medIcon}
            label={"Dặn thuốc"}
            state={medicineLetter}
            setState={setMedicineLetter}
          />

          <NotificationSettingItem
            icon={leaveIcon}
            label={"Xin nghỉ"}
            state={leaveLetter}
            setState={setLeaveLetter}
          />

          <NotificationSettingItem
            icon={noteIcon}
            label={"Lời nhắn"}
            state={noteLetter}
            setState={setNoteLetter}
          />

          <NotificationSettingItem
            icon={pickupIcon}
            label={"Đón về"}
            state={pickupLetter}
            setState={setPickupLetter}
          />
        </View>
      </ScrollView>
    </WhiteBody>
  );
};

export default NotificationSetting;
