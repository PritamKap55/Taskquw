// hooks/useTableLayoutEdit.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { sendNotification } from "../services/sendNotification";

import {
  appendTableRow,
  FormField,
  getTableRow,
  updateTableRow,
} from "../services/tableLayoutService";




export const useTableLayoutEdit = () => {
  const params = useLocalSearchParams();
  const [hue, setHue] = useState(0);
  const [formData, setFormData] = useState<FormField[]>([]);
  const selectedId = String(params?.selectedId ?? "");
  const spreadsheetId = String(params?.id ?? "");
  const layout = String(params?.layout ?? "");
  const name = String(params?.name ?? "");
  const template = String(params?.template ?? "");
  const userEmail = String(params?.userEmail ?? "");
  const login = String(params?.login ?? "");
  const canEdit = String(params?.canEdit ?? "");
  const [notificationRef, setNotificationRef] = useState(true);
  const [nftokensRef, setNftokensRef] = useState<string[]>([]);

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

  const getValue = async () => {


    if (!selectedId || selectedId === "0") {
      return;
    }

    try {
      const result = await getTableRow(
        spreadsheetId,
        selectedId
      );
      setFormData(result.FormField);
      setNftokensRef(result.tokens);

    } catch (error) {
      console.error("Error GetValue:", error);

      Alert.alert(
        "Error",
        "Failed to load data"
      );
    }
  };

  const submit = async () => {
    try {
      if (selectedId !== "0") {
        await updateTableRow(
          spreadsheetId,
          selectedId,
          formData
        );
      } else {
        await appendTableRow(
          spreadsheetId,
          formData
        );
      }

      if (notificationRef) {
        await callNotification();
        setNotificationRef(false);
      }

      Alert.alert("Success", "Data saved");
      router.push({
        pathname: "/detailspage", params: { canEdit: canEdit, layout: "Table", id: spreadsheetId, headtext: name, userEmail: userEmail, login: login, },
      });
    } catch (error) {
      console.error("Error Submit:", error);

      Alert.alert(
        "Error",
        "Failed to save data"
      );
    }
  };

  const handleChange = (
    index: number,
    newValue: string
  ) => {
    setFormData(prev =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            value: newValue,
          }
          : item
      )
    );
  };

  const addColumn = () => {
    setFormData(prev => [
      ...prev,
      {
        label: "",
        value: "",
      },
    ]);
  };

  const deleteColumn = (index: number) => {
    setFormData(prev =>
      prev.filter((_, i) => i !== index)
    );
  };
  const callNotification = async (): Promise<void> => {
    try {
      await sendNotification(
        nftokensRef,
        String(
          params?.headtext ?? ""
        ),
        "normal",
        {
          sheetId: params?.id,
          NF_Type: 2,
        }
      );
    } catch (error) {
      console.error(
        "Error call_notification:",
        error
      );
    }
  };

  useEffect(() => {
    loadHue();
    getValue();
  }, []);

  return {
    hue,
    setHue,

    formData,

    selectedId,
    spreadsheetId,

    handleChange,
    addColumn,
    deleteColumn,
    submit,
  };
};