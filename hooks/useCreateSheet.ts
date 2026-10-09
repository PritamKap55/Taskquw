// hooks/useCreateSheet.ts

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions } from "react-native";
import { createOrGetFile } from "../services/createSheet";

export const useCreateSheet = () => {
  const params = useLocalSearchParams();
  const [fileName, setFileName] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState("");
  const { width } = Dimensions.get("window");

  const layoutOptions = [
    "List",
    "Check List",
    "Table",
    "Tree",
  ];



  const getOrCreateFile = async () => {
    if (!fileName.trim()) {
      Alert.alert("Error", "Please enter an account name");
      return;
    }

    setLoading(true);

    try {
      const layout = layoutOptions[index];

      const fileId = await createOrGetFile(
        fileName.trim(),
        layout
      );

      Alert.alert("Success", "Created successfully.");

      return fileId;
    } catch (error) {
      console.error("Error getOrCreateFile:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to create spreadsheet."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const login_v = String(params.login ?? "");
    setLogin(login_v);
  }, []);

  return {
    fileName,
    setFileName,
    index,
    setIndex,
    width,
    loading,
    layoutOptions,
    login,
    getOrCreateFile,
  };
};