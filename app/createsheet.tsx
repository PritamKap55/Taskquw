import { registerForPushNotifications } from '@/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getThemeColors } from "./color";
import HeaderComp from "./headercomp";
import ListLayout from "./listlayout";
import { gradientLeafbtn, styles } from "./styles";
import TableLayout from './tablelayout';
import TreeLayout from './treelayout';

export default function createsheet() {
  const [fileName, setFileName] = useState("");
  const [hue, setHue] = useState(0);
  const { bgbodyColor, bgColor, gradientConfig, } = getThemeColors(hue);
  const [index, setIndex] = useState(0);
  const layoutOptions = ["List", "Check List", "Table", "Tree"];
  const { width } = Dimensions.get("window");
  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getOrCreateFile = async (fileName: string) => {
    try {
      const { accessToken } = await GoogleSignin.getTokens();
      const token = await registerForPushNotifications();

      // Check if file already exists
      const query = `name='${fileName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;

      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const searchData = await searchRes.json();

      if (searchData.files?.length > 0) {
        Alert.alert("Success", "File already exists");
        return searchData.files[0].id;
      }

      // Create Spreadsheet
      const createRes = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fileName,
            mimeType: "application/vnd.google-apps.spreadsheet",
            appProperties: {
              app: "PKapp",
              layout: layoutOptions[index],
            },
          }),
        }
      );

      const createData = await createRes.json();
      const spreadsheetId = createData.id;

      // Wait a moment for spreadsheet creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create Sheet2
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                addSheet: {
                  properties: {
                    title: "Sheet2",
                  },
                },
              },
            ],
          }),
        }
      );

      // Write Sheet1 headers
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:C1?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [["text", "note", "bool"]],
          }),
        }
      );

      // Write Sheet2 values
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet2!A1:A2?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [
              ["Notifications token"],
              [token ?? ""],
            ],
          }),
        }
      );

      Alert.alert("Success", "Spreadsheet created successfully.");

      return spreadsheetId;
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create spreadsheet.");
    }
  };

  // const getOrCreateFile = async (fileName: any,) => {
  //   try {
  //     // Get Google access token
  //     const { accessToken } = await GoogleSignin.getTokens();

  //     const query = `name='${fileName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;

  //     // Search for existing file
  //     const searchRes = await fetch(
  //       `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     const searchData = await searchRes.json();

  //     if (searchData.files?.length > 0) {
  //       const fileId = searchData.files[0].id;

  //       Alert.alert("Success", "File already exists");
  //       return fileId;
  //     }

  //     // Create spreadsheet
  //     const createRes = await fetch(
  //       "https://www.googleapis.com/drive/v3/files",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: fileName,
  //           mimeType: "application/vnd.google-apps.spreadsheet",
  //           appProperties: {
  //             app: "PKapp",
  //             layout: layoutOptions[index],
  //           },
  //         }),
  //       }
  //     );

  //     const createData = await createRes.json();

  //     Alert.alert("Success", "File created");
  //     return createData.id;
  //   } catch (error) {
  //     console.log(error);

  //   }
  // };

  useEffect(() => {
    loadHue();
  }, []);
  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />
      <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width)
            setIndex(pageIndex);
          }}
        >
          <View style={styles.slide}>
            <View style={styles.card} pointerEvents="none">

              <ListLayout template="New" layout="" />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card} pointerEvents="none">
              <ListLayout template="New" layout="Check List" />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card} pointerEvents="none">
              <TableLayout template="New" />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card}>
              <TreeLayout template="New" />
            </View>
          </View>
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
        <TouchableOpacity onPress={async () => {
          const fileId = await getOrCreateFile(fileName);
        }}
        >
          <LinearGradient {...gradientLeafbtn} style={styles.leafBtn}  >

            <Text style={styles.btnText}>
              Create New Account
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </LinearGradient>
    </>
  );
}
