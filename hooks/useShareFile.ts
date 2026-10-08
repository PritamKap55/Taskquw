// hooks/useShareFile.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  getSharedUsers,
  shareFile,
  SharedUser,
} from "../services/shareFileService";

export const useShareFile = () => {
  const params = useLocalSearchParams();

  const fileId = String(params?.id ?? "");

  const [hue, setHue] = useState(0);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<
    "reader" | "writer"
  >("reader");

  const [loading, setLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<
    SharedUser[]
  >([]);

  const loadHue = async () => {
    try {
      const savedValue =
        await AsyncStorage.getItem("myHue");

      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.error("Error loadHue:", error);
    }
  };

  const loadSharedUsers = async () => {
    if (!fileId) {
      return;
    }

    try {
      setLoading(true);

      const users = await getSharedUsers(fileId);

      setSharedUsers(users);
    } catch (error) {
      console.error(
        "Error getSharedUsers:",
        error
      );

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to get shared users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShareFile = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Error",
        "Please enter an email address."
      );
      return;
    }

    if (!fileId) {
      Alert.alert(
        "Error",
        "File ID is missing."
      );
      return;
    }

    try {
      setLoading(true);

      await shareFile(
        fileId,
        email.trim(),
        role
      );

      Alert.alert(
        "Success",
        "File shared successfully."
      );

      setEmail("");

      // Refresh shared users after sharing
      await loadSharedUsers();
    } catch (error) {
      console.error(
        "Error shareFile:",
        error
      );

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to share file."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHue();
    loadSharedUsers();
  }, [fileId]);

  return {
    hue,
    setHue,

    email,
    setEmail,

    role,
    setRole,

    loading,
    sharedUsers,

    handleShareFile,
    loadSharedUsers,
  };
};