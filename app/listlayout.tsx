import CheckBox from '@react-native-community/checkbox';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderComp from "./headercomp";
import { gradientConfig, styles } from "./styles";
import { LinearGradient } from 'expo-linear-gradient';

export default function ListLayout() {
  const [fileName, setFileName] = useState("");
  const [hue, setHue] = useState(0);
  const route = useRoute();
  const [items, setItems] = useState<any[]>([]);
  const [files, setFiles] = useState<any>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);

  const params = useLocalSearchParams();

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

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;

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
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;
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
              await GoogleSignin.hasPlayServices();
              await GoogleSignin.signIn();
              const tokens = await GoogleSignin.getTokens();
              const accessToken = tokens.accessToken;
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
      <HeaderComp />
      <View style={[styles.bodyLayout]}>

        <ScrollView
          style={{
            flex: 1,
            padding: 10,
          }}
        >
          {items.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {/* Checkbox */}
              {(params?.layout === "Check List") && (
                <CheckBox
                  value={String(item.bool).trim().toUpperCase() === "TRUE"}
                  onValueChange={(value) =>
                    handleChange(
                      index,
                      "bool",
                      value ? "TRUE" : "FALSE"
                    )
                  }
                />
              )}

              {/* Text input */}
              <TextInput
                style={{
                  flex: 1,
                  borderBottomWidth: 1,
                  marginHorizontal: 10,
                }}
                value={item.text}
                onChangeText={(text) =>
                  handleChange(index, "text", text)
                }
                onBlur={() =>
                  Submit(index, "text", item.text)
                }
              />

              {/* Note icon */}
              <TouchableOpacity
                onPress={() => setOpenNoteIndex(openNoteIndex === index ? null : index)}
              >
                <Text style={{ fontSize: 20 }}>
                  {item.note === "" ? "📌" : "📋"}
                </Text>
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                onPress={() => deleteRow(index)}
              >
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 10,
                  }}
                >
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
      <LinearGradient {...gradientConfig}>
        <View style={[styles.footerLayout]}>
          <Text>Name</Text>

          <TextInput
            placeholder="Enter File name"
            value={fileName}
            onChangeText={setFileName}
            style={{
              borderWidth: 1,
              marginBottom: 10,
              padding: 8,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              // onPress={downloadPDF}
              style={{
                padding: 10,
                borderWidth: 1,
              }}
            >
              <Text>Download PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={downloadCSV}
              style={{
                padding: 10,
                borderWidth: 1,
              }}
            >
              <Text>Download CSV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {/* Delete Popup */}
      {showDeletePopup && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text>
              Are you sure you want to delete?
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                //onPress={confirmDelete}
                style={{ marginRight: 20 }}
              >
                <Text>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setShowDeletePopup(false)
                }
              >
                <Text>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </>
  );
}

