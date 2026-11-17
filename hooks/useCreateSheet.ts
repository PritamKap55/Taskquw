// hooks/useCreateSheet.ts

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions } from "react-native";
import { createOrGetFile } from "../services/createSheet";

export const useCreateSheet = () => {
  const params = useLocalSearchParams();
  const [fileName, setFileName] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
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

      const [fileId, message] = await createOrGetFile(
        fileName.trim(),
        layout
      );
      if (fileId === false) {
        Alert.alert("Error", message);
        return;
      }

      Alert.alert("Success",message);

      router.push({ pathname: "/account", params: { email: email, login: login }, });

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
    const checkLogin = async () => {
      try {
        const login_v = String(params.login ?? "");

        const userInfo = await GoogleSignin.signIn();

        const userEmail = userInfo.data?.user?.email ?? "";

        setEmail(userEmail);
        setLogin(login_v);
      } catch (error) {
        console.error("Google Sign-In Error:", error);
      }
    };

    checkLogin();
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