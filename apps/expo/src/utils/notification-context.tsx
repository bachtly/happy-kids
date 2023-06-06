import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { api } from "./api";

Notifications.setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

interface NotificationContextProps {
  token?: string | null;
}

const NotificationContext = createContext<NotificationContextProps>({
  token: ""
});

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  // const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const [token, setToken] = useState<undefined | string>(undefined);

  const notiMutation = api.noti.registerToken.useMutation();

  useEffect(() => {
    console.log("[NOTIFICATION CONTEXT] Use effect");
    void registerForPushNotificationsAsync().then((token) => setToken(token));

    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notification) => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "[NOTIFICATION CONTEXT] Handling notification from background"
        );
        console.log(response);
        console.log(response.notification.request.trigger);
        const route = JSON.parse(
          (response.notification.request.content.data.route as string) ?? ""
        ) as {
          pathname?: string;
          params?: Record<string, any>;
        };
        console.log(route);
        router.replace("teacher/teacher-landing-screen");
        router.push(route);
      });

    return () => {
      // notificationListener.current &&
      // Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    console.log("Token has changed", token);
    token && notiMutation.mutate({ token: token });
  }, [token]);

  return (
    <NotificationContext.Provider value={{ token: token }}>
      {children}
    </NotificationContext.Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C"
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

export { NotificationContext, NotificationProvider };
export type { NotificationContextProps };
