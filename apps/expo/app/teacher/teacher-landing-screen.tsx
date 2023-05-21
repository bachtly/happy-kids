import TeacherHomeScreen from "./teacher-home-screen";
import PostHomeScreen from "./post/post-home-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme, Text } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountHomeScreen from "./account/account-home-screen";
import { Stack } from "expo-router";
import React from "react";
import NotiHomeScreen from "./noti/noti-home-screen";

const Tab = createBottomTabNavigator();

const TeacherLandingScreen = () => {
  const theme = useTheme();
  const { colors } = theme;

  const headerTitleStyle = {
    fontFamily: theme.fonts.headlineSmall.fontFamily,
    fontSize: theme.fonts.headlineSmall.fontSize,
    fontWeight: theme.fonts.headlineSmall.fontWeight
  };

  const getIcon = (name: string, color: string, focused: boolean) => {
    return <Ionicons name={name} size={focused ? 27 : 25} color={color} />;
  };

  const getLabel = (label: string, color: string, focused: boolean) => {
    return (
      <Text style={{ color: color, fontSize: focused ? 11 : 10 }}>{label}</Text>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 60 },
          tabBarItemStyle: { paddingVertical: 8 },
          tabBarActiveTintColor: colors.primary,
          headerTintColor: colors.onPrimary,
          headerStyle: { backgroundColor: colors.primary }
        }}
      >
        <Tab.Screen
          name="Trang chủ"
          component={TeacherHomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              getIcon("home-outline", color, focused),
            tabBarLabel: ({ color, focused }) =>
              getLabel("Trang chủ", color, focused),
            headerTitleStyle: headerTitleStyle,
            headerTitleAlign: "center"
          }}
        />
        <Tab.Screen
          name="Bảng tin"
          component={PostHomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              getIcon("newspaper-outline", color, focused),
            tabBarLabel: ({ color, focused }) =>
              getLabel("Bảng tin", color, focused),
            headerTitleStyle: headerTitleStyle,
            headerTitleAlign: "center"
          }}
        />
        <Tab.Screen
          name="Thông báo"
          component={NotiHomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              getIcon("notifications-outline", color, focused),
            tabBarLabel: ({ color, focused }) =>
              getLabel("Thông báo", color, focused),
            headerTitleStyle: headerTitleStyle,
            headerTitleAlign: "center"
          }}
        />
        <Tab.Screen
          name="Tài khoản"
          component={AccountHomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) =>
              getIcon("person-outline", color, focused),
            tabBarLabel: ({ color, focused }) =>
              getLabel("Tài khoản", color, focused),
            headerTitleStyle: headerTitleStyle,
            headerTitleAlign: "center"
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TeacherLandingScreen;
