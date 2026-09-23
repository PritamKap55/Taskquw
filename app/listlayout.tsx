import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { Buffer } from "buffer";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getThemeColors } from "./color";
import { list } from "./data";
import { getAccessToken } from './googleAuth';
import HeaderComp from "./headercomp";
import Loader from './loader';
import { sendNotification } from './sendNotification';
import { styles } from "./styles";
global.Buffer = Buffer;

type LayoutProps = {
  template: string;
  layout: string;
};

export default function ListLayout({ template, layout }: LayoutProps) {
  const [fileName, setFileName] = useState("");
  const [hue, setHue] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [files, setFiles] = useState<any>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);
  const { bgbodyColor, bgColor, gradientConfig, bglabelColor, gradientLeafbtn, } = getThemeColors(hue);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const [notificationRef, setNotificationRef] = useState(false);
  const [nftokensRef, setNftokensRef] = useState<string[]>([]);

  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.error("Error loadHue", error);
    }
  };

  const handleChange = (
    index: number,
    field: "text" | "note" | "bool",
    value: any
  ) => {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    setItems(newItems);
    if (field == "bool") {
      Submit(index, field, value);
    }
  };

  const checkWritePermission = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) return false;

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${params?.id}?fields=capabilities`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    return data.capabilities?.canEdit ?? false;
  };

  const Submit = async (
    index: number,
    field: "text" | "note" | "bool",
    value: string | boolean
  ) => {

    setLoading(true)
    try {

      const canEdit = await checkWritePermission();

      if (!canEdit) {
        Alert.alert(
          "Permission Denied",
          "You don't have permission to edit this file."
        );
        return;
      }

      const colMap = {
        text: "A",
        note: "B",
        bool: "C",
      };

      const col = colMap[field];

      const accessToken = await getAccessToken();
      if (!accessToken) return;

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!${col}${index + 2}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [[value]],
          }),
        }
      );

      await getSheetData();
      setLoading(false)
      if (notificationRef == true) {
        call_notification();
      }
      setNotificationRef(false)

    } catch (error) {
      setLoading(false)
      console.error("Error Submit", error);
    }
    setLoading(false)
  };

  const getSheetData = async () => {
    setLoading(true)
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!A2:C100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      const values = data?.values || [];

      let updated = values.map((row: any[]) => ({
        text: row[0] || "",
        note: row[1] || "",
        bool: row[2] === "TRUE" || row[2] === true,
      }));

      while (updated.length < 10) {
        updated.push({
          text: "",
          note: "",
          bool: false,
        });
      }

      updated.push({
        text: "",
        note: "",
        bool: false,
      });

      setItems(updated);


      if (!accessToken) {

        return;
      }

      const range = encodeURIComponent("Sheet2!A:A");
      // Read existing values
      const getResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/${range}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data2 = await getResponse.json();

      const tokens = (data2.values || [])
        .slice(1)
        .map((row: any[]) => row[0])
        .filter((token: any) => token);

      setNftokensRef(tokens);
      setLoading(false)
    } catch (error) {
      console.error("Error loading sheet:", error);
      setLoading(false)
    }
    setLoading(false)
  };

  const deleteRow = async (rowIndex: number) => {

    Alert.alert(
      "Delete Row",
      "Are you sure you want to delete this row?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true)
              const accessToken = await getAccessToken();
              if (!accessToken) return;
              const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}:batchUpdate`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    requests: [
                      {
                        deleteDimension: {
                          range: {
                            sheetId: 0, // Sheet1 ID
                            dimension: "ROWS",
                            startIndex: rowIndex + 1, // skip header row
                            endIndex: rowIndex + 2,
                          },
                        },
                      },
                    ],
                  }),
                }
              );

              const data = await response.json();
              setLoading(false)
              await getSheetData();

            } catch (error) {
              setLoading(false)
              console.error("Error Delete", error);
            }
          },
        },
      ]
    );
    setLoading(false)
  };

  useEffect(() => {
    loadHue();
    removeSheetIdFromStorage();
    if (template === "New") {
      setItems(list.values);
    } else {
      getSheetData();
    }

  }, []);

  const removeSheetIdFromStorage = async () => {
    try {
      const savedValue = await AsyncStorage.getItem(params?.id as string);
      if (savedValue !== null) {
        await AsyncStorage.removeItem(params?.id as string);
      }
    } catch (error) {
      console.error("Error removing sheetId:", error);
    }
  };

  const call_notification = async () => {
    try {

      // Example notification
      await sendNotification(
        nftokensRef,
        String(params?.headtext ?? ""),
        "normal",
        {
          sheetId: params?.id,
          NF_Type: 2,
        }
      );

    } catch (error) {
      console.error("Error call_notification :", error);
    }
  };

  return (
    <>
      {template === undefined && (
        <HeaderComp hue={hue} setHue={setHue} />
      )}
      <View style={[{ height: template === undefined ? "68%" : "100%", backgroundColor: bgbodyColor, },]} >

        <ScrollView style={{ flex: 1, padding: 10, }}>
          {items.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, }} >
              {(params?.layout === "Check List" || layout === "Check List") && (
                <CheckBox value={String(item.bool).trim().toUpperCase() === "TRUE"}
                  onValueChange={(value) => handleChange(index, "bool", value ? "TRUE" : "FALSE")}
                  tintColors={{
                    true: "#000000",
                    false: "#000000",
                  }}
                />
              )}
              <TextInput style={{ flex: 1, borderBottomWidth: 1, marginHorizontal: 10, }}
                value={item.text}
                onChangeText={(text) => handleChange(index, "text", text)}
                onBlur={() => Submit(index, "text", item.text)}
              />

              <TouchableOpacity onPress={() => setOpenNoteIndex(openNoteIndex === index ? null : index)} >
                <Text style={{ fontSize: 20 }}>
                  {item.note === "" ? "📌" : "📋"}
                </Text>
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity onPress={() => deleteRow(index)}>
                <Text style={{ fontSize: 20, marginLeft: 10, }}>
                  ❌
                </Text>
              </TouchableOpacity>

              {/* Notes popup */}
              {openNoteIndex === index && (
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={item.note}
                  placeholder="Write note..."
                  onChangeText={(text) =>
                    handleChange(index, "note", text)
                  }
                  onBlur={() =>
                    Submit(index, "note", item.note)
                  }
                  style={{
                    position: "absolute",
                    top: 40,
                    // right: 0,
                    left: "50%",
                    transform: [{ translateX: -100 }], // half of width (200/2)
                    width: 200,
                    borderWidth: 1,
                    backgroundColor: "#fff",
                    padding: 8,
                    zIndex: 9
                  }}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </View >

      {template === undefined && (
        <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >

            <TouchableOpacity onPress={() => router.push({ pathname: "/shareFile", params: { id: params?.id } })}>
              <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
                <Text style={styles.btnText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>

        </LinearGradient>
      )
      }
      <Loader visible={loading} />
    </>
  );
}

