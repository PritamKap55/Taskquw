import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { gradientLeafbtn, styles } from "./styles";
// import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getAccessToken } from "./googleAuth";
import HeaderComp from "./headercomp";

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

  const getSheets = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const query = "mimeType='application/vnd.google-apps.spreadsheet'";
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

    } catch (error) {
      console.log("Error", error);
    }
  };

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

  useEffect(() => {
    loadHue();
    getSheets();
  }, []);

  useEffect(() => {
    console.log("Hue:", hue);
  }, [hue]);


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

        <TouchableOpacity onPress={() => router.push({ pathname: "/createsheet", })}>
          <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
            <Text style={styles.btnText}>
              Create New Account
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </LinearGradient>
    </>
  );
}