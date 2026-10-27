// hooks/useTableLayoutEdit.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

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
      const data = await getTableRow(
        spreadsheetId,
        selectedId
      );

      setFormData(data);
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

      Alert.alert("Success", "Data saved");

      router.replace({
        pathname: "/tablelayout",
        params: {
          layout,
          id: spreadsheetId,
          headtext: name,
        },
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