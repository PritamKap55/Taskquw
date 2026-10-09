import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { getAccessToken } from "../services/googleAuth";
import { FileItem, getGoogleSheets, notificationAccess, } from "../services/accountSheets";

import { registerForPushNotifications } from "@/notification";
import { getInDeviceAccount, saveInDeviceAccount, } from "../services/dataStorage";

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
        if (!accessToken) {
          return;
        }

        const NF_token =
          await registerForPushNotifications();

        const googleFiles =
          await getGoogleSheets(accessToken);


        setFiles(googleFiles);

        // Save local copy
        await saveInDeviceAccount(email, googleFiles);

        for (const file of googleFiles) {

          const permission =
            file.permissions?.find(
              (p: any) =>
                p.emailAddress
                  ?.toLowerCase() === email
            );

          const writerPermission =
            permission?.role === "writer" ||
            permission?.role === "owner";

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