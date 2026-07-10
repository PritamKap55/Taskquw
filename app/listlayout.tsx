import CheckBox from '@react-native-community/checkbox';
import { Buffer } from "buffer";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAccessToken } from './googleAuth';
import HeaderComp from "./headercomp";

import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
;

import { gradientLeafbtn, styles } from "./styles";
global.Buffer = Buffer;
export default function ListLayout() {
  const [fileName, setFileName] = useState("");
  const [hue, setHue] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [files, setFiles] = useState<any>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);

  const params = useLocalSearchParams();
  const bgbodyColor = `hsl(${hue}, 100%, 95%)`;
  const bgF1Color = `hsl(${hue}, 100%, 94%)`;
  const bgF2Color = `hsl(${hue}, 100%, 75%)`;
  const bgF3Color = `hsl(${hue}, 100%, 27%)`;

  const gradientConfig: {
    colors: readonly [string, string, string];
    locations: readonly [number, number, number];
  } = {
    colors: [bgF1Color, bgF2Color, bgF3Color],
    locations: [0, 0.5, 1],
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

  const Submit = async (
    index: number,
    field: "text" | "note" | "bool",
    value: string | boolean
  ) => {
    try {
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

    } catch (error) {
      console.log("Submit Error:", error);
    }
  };

  const getSheetData = async () => {
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
      console.log("data get", data)
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

    } catch (error) {
      console.log("Error loading sheet:", error);
    }
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

              console.log("Delete Success:", data);

              await getSheetData();

            } catch (error) {
              console.log("Delete Error:", error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {

    if (params?.new == "List") {
      let NewAccount = [];
      while (NewAccount.length < 11) {
        NewAccount.push("");
      }
      setItems(NewAccount);
    } else {
      getSheetData();
    }
  }, []);



  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />
      <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>

        <ScrollView style={{ flex: 1, padding: 10, }}>
          {items.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, }} >
              {(params?.layout === "Check List") && (
                <CheckBox value={String(item.bool).trim().toUpperCase() === "TRUE"}
                  onValueChange={(value) => handleChange(index, "bool", value ? "TRUE" : "FALSE")}
                />
              )}
              <TextInput style={{ flex: 1, borderBottomWidth: 1, marginHorizontal: 10, }}
                value={item.text} onChangeText={(text) => handleChange(index, "text", text)}
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
      </View>
      <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>
        <View style={styles.inputBox}>
          <Text style={styles.inputlabel}>Name</Text>

          <TextInput
            placeholder="Enter File name"
            value={fileName}
            onChangeText={setFileName}
            style={styles.inputtext}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >

          <TouchableOpacity
            //onPress={downloadPDF}
          >
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text>Share</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            //onPress={downloadPDF}
          ><LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text> PDF</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            //onPress={downloadCSV}
          >
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text> CSV</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </LinearGradient>

    </>
  );
}

