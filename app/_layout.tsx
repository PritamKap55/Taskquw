import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { registerForPushNotifications } from "../notification";
import { getAccessToken } from "./googleAuth";

// ----------------------------------------
// Notification display settings
// ----------------------------------------

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const type =
      notification.request.content.data?.notificationType;

    // Silent notification
    if (type === "silent") {
      return {
        shouldShowBanner: false,
        shouldShowList: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    }

    // Normal notification
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Google Login
    GoogleSignin.configure({
      webClientId: "470784951477-1mcdh3c1puclmb9ttot8mchl3onvsshb.apps.googleusercontent.com",
      //webClientId: "2799593297-t7c7s058d9inlbfl37et9837ob39ku5f.apps.googleusercontent.com",
    });

    // Register notification
    registerForPushNotifications();

    // ----------------------------------------
    // Notification received while app is open
    // ----------------------------------------

    const notificationListener =
      Notifications.addNotificationReceivedListener(
        async (notification) => {
          const data = notification.request.content.data;
          switch (Number(data?.NF_Type ?? 0)) {
            case 1:
              await insertNF_token(
                String(data?.sheetId ?? ""),
                String(data?.userNF_token ?? "")
              );
              break;

            case 2:
              console.log(String(data?.sheetId ?? ""));

              try {
                await AsyncStorage.setItem(String(data?.sheetId ?? ""), "1");
              } catch (error) {
                console.error("Error saveHue", error);
              }

              break;

            case 3:
              console.log("NF Type 3");
              break;

            default:
              console.log("Unknown NF Type");
              break;
          }
        }
      );

    // ----------------------------------------
    // User taps notification
    // ----------------------------------------

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data =
            response.notification.request.content.data;

          const screen = data?.screen;

          if (screen === "detailspage") {
            router.push("/detailspage");
          }
        }
      );

    // Cleanup listeners
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  async function insertNF_token(
    sheetId: string,
    userNF_token: string
  ) {
    const accessToken = await getAccessToken();
    if (!accessToken) return;
    const range = encodeURIComponent("Sheet2!A:A");
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[userNF_token]],
        }),
      }
    );
  }
  return (
    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="account" />
        <Stack.Screen name="listlayout" />
        <Stack.Screen name="detailspage" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

