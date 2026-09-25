import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { getAccessToken } from "../app/googleAuth";
import {getGoogleSheets,notificationAccess,FileItem,} from "../services/accountSheets";

import { registerForPushNotifications } from "@/notification";
import {
  saveSheetsToDevice,
} from "../services/accountStorage";

export function useAccount() {

  const params = useLocalSearchParams();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] =
    useState<FileItem | null>(null);

  const [hue, setHue] = useState(0);

  const [sheetStatus, setSheetStatus] =
    useState<Record<string, string | null>>({});

  const [loading, setLoading] =
    useState(false);

  const [userEmail, setUserEmail] =
    useState("");

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

      const email = String(
        params.email ?? ""
      )
        .trim()
        .toLowerCase();

      setUserEmail(email);

      const accessToken =
        await getAccessToken();

      if (!accessToken) {
        return;
      }

      const NF_token =
        await registerForPushNotifications();

      const googleFiles =
        await getGoogleSheets(
          accessToken
        );

      setFiles(googleFiles);

      // Save local copy
      await saveSheetsToDevice(
        email,
        googleFiles
      );

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

  return {
    files,
    selectedFile,
    setSelectedFile,
    hue,
    setHue,
    sheetStatus,
    loading,
    userEmail,
  };
}