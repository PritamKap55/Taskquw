import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles";
// import LinearGradient from 'react-native-linear-gradient';
import { registerForPushNotifications } from '@/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { getThemeColors } from "./color";
import { getAccessToken } from "./googleAuth";
import HeaderComp from "./headercomp";
import Loader from "./loader";
import { sendNotification } from './sendNotification';

GoogleSignin.configure({
  webClientId: '470784951477-1mcdh3c1puclmb9ttot8mchl3onvsshb.apps.googleusercontent.com',
  //webClientId:'2799593297-t7c7s058d9inlbfl37et9837ob39ku5f.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/drive',
  ],
});

export default function Account() {

  const params = useLocalSearchParams();


  type FileItem = {
    id: string;
    name: string;
  };
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [hue, setHue] = useState(0);
  const { bgbodyColor, bgColor, gradientConfig, gradientLeafbtn, oppositeColor } = getThemeColors(hue);
  const [sheetStatus, setSheetStatus] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [userEmail, setuserEmail] = useState("");
  const getSheets = async () => {
    setLoading(true)
    try {

      const accessToken = await getAccessToken();
      if (!accessToken) return;
      const NF_token = await registerForPushNotifications();
      const query = "mimeType='application/vnd.google-apps.spreadsheet' and properties has { key='app' and value='PKapp' } and trashed=false";
      const url =
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}&fields=files(id,name,properties,permissions)`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      setFiles(data.files);
      setLoading(false)
      for (const file of data.files) {

        setuserEmail(String(params.email ?? "").trim().toLowerCase());


        const permission = file.permissions?.find(
          (p: any) =>
            p.emailAddress?.toLowerCase() === userEmail
        );
        let writerPermission = false;
        console.log(permission?.role)
        if (permission?.role === "writer" || permission?.role === "owner") {
          writerPermission = true;
        }

        await notification_access(file.id, accessToken, NF_token!, writerPermission);

        saveSheetsToDevice();
      }

    } catch (error) {
      setLoading(false)
      console.error("Error getSheets", error);
    }
    setLoading(false)
  };

  const loadHue = async () => {

    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
      console.log(hue)
    } catch (error) {
      console.error("Error loadHue", error);
    }
  };

  const SHEETS_CACHE_KEY = userEmail + "Account";

  const saveSheetsToDevice = async () => {
    try {
      await AsyncStorage.setItem(
        SHEETS_CACHE_KEY,
        JSON.stringify(files)
      );

      alert("Sheets saved to device");
    } catch (error) {
      alert("Error saving sheets:");
    }
  };

  const getSheetsFromDevice = async () => {
    try {
      const savedData = await AsyncStorage.getItem(SHEETS_CACHE_KEY);

      if (!savedData) {
        return [];
      }

      return JSON.parse(savedData);
    } catch (error) {
      console.error("Error reading sheets:", error);
      return [];
    }
  };

  useEffect(() => {
    loadHue();
    getSheets();
  }, []);

  useEffect(() => {

  }, [hue]);


  async function notification_access(
    sheetId: string,
    accessToken: string,
    NF_token: string,
    writerPermission: boolean
  ) {
    const range = encodeURIComponent("Sheet2!A:B");
    // Read existing values
    const getResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await getResponse.json();
    console.log("data", data)
    const values: string[][] = data.values || [];

    // Check if value already exists
    const exists = values.some(row => row[0] === NF_token);
    console.log("exists", exists + ":" + writerPermission)


    if (!exists && writerPermission == true) {
      const appendResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet2!A:A:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [[NF_token, "True"]],
          }),
        }
      );

      const appendData = await appendResponse.json();

      if (!appendResponse.ok) {
        console.error("Insert failed:", appendData);
      } else {
        console.log("NF_token inserted:", appendData);
      }
    } else {
      console.log("NF_token already exists, not inserting");
    }
    const savedValue = await AsyncStorage.getItem(sheetId);

    if (!exists && writerPermission == false) {
      const tokens = data.values
        ?.filter((row: string[]) => row?.[1] === "True")
        ?.map((row: any[]) => row?.[0]) || [];
      sendNotification(
        tokens,
        "Add Notification token :" + sheetId.toString(),
        "silent",
        {
          userNF_token: NF_token,
          userType: "1",
          sheetId: sheetId,
          NF_Type: 1,
        }

      ).catch(console.error);
    }
    setSheetStatus(prev => ({
      ...prev,
      [sheetId]: savedValue,
    }));
    if (exists) {
      return;
    }
    else {
      return;
    }
  }

  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />
      <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.fileList}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={[styles.fileItem, selectedFile?.id === item.id && styles.active,]}
              onPress={() => router.push({ pathname: "/detailspage", params: { layout: item.properties?.layout, id: item.id, headtext: item.name }, })}
            >
              <View
                style={[
                  styles.fileNumber,
                  sheetStatus[item.id] === "1" && {
                    backgroundColor: "#00A300",
                    borderRadius: 18,
                  },
                ]}
              >
                <Text
                  style={styles.numberText}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </View>

              <Text style={styles.fileName}>
                {item.name}
              </Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>

        <TouchableOpacity onPress={() => router.push({ pathname: "/createsheet", params: { headtext: "Create Page" } })}>
          <LinearGradient {...gradientLeafbtn} style={[styles.leafBtn]} >
            <Text style={styles.btnText}>
              Create New Account
            </Text>

          </LinearGradient>
        </TouchableOpacity>


      </LinearGradient>



      <View style={[styles.footerMobile, { backgroundColor: bgColor }]}>

      </View>
      <Loader visible={loading} />
    </>
  );
}