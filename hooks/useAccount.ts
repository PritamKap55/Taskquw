import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { FileItem, getGoogleSheets, notificationAccess, } from "../services/accountSheets";
import { getAccessToken } from "../services/googleAuth";

import { registerForPushNotifications } from "@/notification";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getInDeviceAccount, saveInDeviceAccount, } from "../services/dataStorage";

GoogleSignin.configure({
  webClientId:
    '2799593297-t7c7s058d9inlbfl37et9837ob39ku5f.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
  ],
});

export function useAccount() {

  const params = useLocalSearchParams();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [hue, setHue] = useState(0);
  const [sheetStatus, setSheetStatus] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [login, setLogin] = useState("");
  const loadHue = async (): Promise<void> => {

    try {

      const savedValue =
        await AsyncStorage.getItem("myHue");

      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }

    } catch (error) {
      console.error(
        "Error loadHue:",
        error
      );
    }
  };

  const getSheets = async (): Promise<void> => {

    setLoading(true);

    try {
      const email = String(params.email ?? "").trim().toLowerCase();
      const login_v = String(params.login ?? "");
      setUserEmail(email);
      setLogin(login_v);

      if (login_v == "Offline") {
        const offineData = await getInDeviceAccount(email);
        setFiles(offineData);
      }
      else {
        const accessToken = await getAccessToken();
        console.log("accessToken", "1");
        if (!accessToken) {
          return;
        }

        const NF_token =
          await registerForPushNotifications();
        console.log("accessToken", "3");

        const googleFiles =
          await getGoogleSheets(accessToken);
        console.log("accessToken", "2");

        setFiles(googleFiles);

        // Save local copy
        await saveInDeviceAccount(email, googleFiles);
        setLoading(false);
        for (const file of googleFiles) {

          const writerPermission = file.capabilities?.canEdit ?? false

          await notificationAccess(
            file.id,
            accessToken,
            NF_token!,
            writerPermission
          );

          const savedValue =
            await AsyncStorage.getItem(
              file.id
            );

          setSheetStatus(prev => ({
            ...prev,
            [file.id]: savedValue,
          }));
        }
      }
    } catch (error) {

      console.error(
        "Error getSheets:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadHue();
    getSheets();

  }, []);
  return { files, selectedFile, setSelectedFile, hue, setHue, sheetStatus, loading, userEmail, login };
}