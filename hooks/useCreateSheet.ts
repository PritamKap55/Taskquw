// hooks/useCreateSheet.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { Alert, Dimensions } from "react-native";
import { useThemeColors } from "../styles/color";
import { createOrGetFile } from "../services/createSheet";

export const useCreateSheet = () => {
  const [fileName, setFileName] = useState("");
  const [hue, setHue] = useState(0);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const { width } = Dimensions.get("window");

  const {
    bgbodyColor,
    bgColor,
    gradientConfig,
    bglabelColor,
    oppositeColor,
    gradientLeafbtn,
  } = useThemeColors();

  const layoutOptions = [
    "List",
    "Check List",
    "Table",
    "Tree",
  ];

  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem("myHue");

      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.error("Error loadHue:", error);
    }
  };

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
    loadHue();
  }, []);

  return {
    fileName,
    setFileName,

    hue,
    setHue,

    index,
    setIndex,

    width,
    loading,

    bgbodyColor,
    bgColor,
    gradientConfig,
    bglabelColor,
    oppositeColor,
    gradientLeafbtn,

    layoutOptions,

    getOrCreateFile,
  };
};