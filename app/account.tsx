import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { gradientConfig, gradientLeafbtn, styles } from "./styles";
// import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
  const [showPopup, setShowPopup] = useState(false);

  const [hue, setHue] = useState(0);
  //const [errorLog, setErrorLog] = useState("Account");

  const getSheets = async () => {
    try {
      //  setErrorLog(prev => prev + ":" + "getSheets")
      // Google login
      await GoogleSignin.hasPlayServices();
      //setErrorLog(prev => prev + ":" + "GoogleSignin.hasPlayServices()")
      await GoogleSignin.signIn();
      //setErrorLog(prev => prev + ":" + "GoogleSignin.signIn()")

      // get token
      const tokens = await GoogleSignin.getTokens();
      //setErrorLog(prev => prev + ":" + "tokens")
      //setErrorLog(prev => prev + ":" + tokens)
      const accessToken = tokens.accessToken;
      //setErrorLog(prev => prev + ":" + "accessToken")
      //setErrorLog(prev => prev + ":" + accessToken)
      // get only spreadsheet files
      const query =
        "mimeType='application/vnd.google-apps.spreadsheet'";
      //setErrorLog(prev => prev + ":" + query)

      const url =
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}&fields=files(id,name,appProperties)`;

      //setErrorLog(prev => prev + ":" + url)
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      //setErrorLog(prev => prev + ":" + "response")
      const data = await response.json();
      //setErrorLog(prev => prev + ":" + "data")
      //setErrorLog(prev => prev + ":" + data)

      console.log("Sheets List:");
      console.log(data.files);
      setFiles(data.files);
      //setErrorLog(prev => prev + ":" + data.files)
    } catch (error) {
      console.log(error);
      //setErrorLog(prev => prev + ":" + "error")
      //setErrorLog(prev => prev + ":" + error)
    }
  };



  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      console.log("get Value ");
      console.log(savedValue);

      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
        console.log(hue);
      }
    } catch (error) {
      console.log(error);
      console.log("error");
    }
  };

  useEffect(() => {
    loadHue();
    getSheets();
  }, []);

  return (
    <View >

      <HeaderComp />
      <View style={[styles.bodyLayout]}>


        {/* <Button
          title="Continue with Google Sheet"
          onPress={getSheets}
        /> */}
        <Text>
          {/* {errorLog} */}
        </Text>
        {/* <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text>{item.name}</Text>
          )}
        /> */}

        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.fileList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.fileItem,
                selectedFile?.id === item.id && styles.active,
              ]}
              onPress={() => router.push({ pathname: "/detailspage", params: { layout: item.appProperties?.layout,id:item.id }, })}
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

      <LinearGradient {...gradientConfig}>
        <View style={[styles.footerLayout]}>

          <TouchableOpacity onPress={() => router.push({ pathname: "/detailspage", })}>
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text style={styles.btnText}>
                Open
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push({ pathname: "/sharesheet", })}>
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text style={styles.btnText}>
                Share
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push({ pathname: "/createsheet", })}>
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text style={styles.btnText}>
                Create New Account
              </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>

      </LinearGradient>


    </View>
  );
}