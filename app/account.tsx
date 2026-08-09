import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { gradientLeafbtn, styles } from "./styles";
// import LinearGradient from 'react-native-linear-gradient';
import { registerForPushNotifications } from '@/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getThemeColors } from "./color";
import { getAccessToken } from "./googleAuth";
import HeaderComp from "./headercomp";
import { sendNotification } from "./sendNotification";

GoogleSignin.configure({
  webClientId:
    '470784951477-1mcdh3c1puclmb9ttot8mchl3onvsshb.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
  ],
});

export default function Account() {

  type FileItem = {
    id: string;
    name: string;
  };
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [hue, setHue] = useState(0);
  const { bgbodyColor, bgColor, gradientConfig, } = getThemeColors(hue);


  const getSheets = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;
      const NF_token = await registerForPushNotifications();
      const query = "mimeType='application/vnd.google-apps.spreadsheet' and appProperties has { key='app' and value='PKapp' } and trashed=false";
      const url =
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}&fields=files(id,name,appProperties)`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      setFiles(data.files);

      for (const file of data.files) {
        await notification_access(file.id, accessToken, NF_token!);
      }

    } catch (error) {
      console.log("Error getSheets", error);
    }
  };

  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.log("Error loadHue", error);
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
    NF_token: string
  ) {
    const range = encodeURIComponent("Sheet2!A:A");
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

    const values: string[][] = data.values || [];

    // Check if value already exists
    const exists = values.some(row => row[0] === NF_token);

    if (exists) {

      return;
    }

    const tokens = [
      data.values?.[0]?.[0]
    ];

    console.log("data.values?.[0]?.[0];", data.values?.[0]?.[0])

    sendNotification(
      tokens,
      "Add Notification token",
      "silent",
      {
        userNF_token: NF_token,
        userType: "1",
        sheetId: sheetId,
        NF_Type: 1,
      }

    ).catch(console.error);

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
              onPress={() => router.push({ pathname: "/detailspage", params: { layout: item.appProperties?.layout, id: item.id, headtext: item.name }, })}
            >
              <View style={styles.fileNumber}>
                <Text style={styles.numberText}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </View>

              <Text style={styles.fileName}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>

        <TouchableOpacity onPress={() => router.push({ pathname: "/createsheet", params: { headtext: "Create Page" } })}>
          <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
            <Text style={styles.btnText}>
              Create New Account
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </LinearGradient>
      <View style={[styles.footerMobile, { backgroundColor: bgColor }]}>

      </View>
    </>
  );
}