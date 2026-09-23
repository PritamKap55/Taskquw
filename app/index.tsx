import NetInfo from "@react-native-community/netinfo";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from "./loginstyles";
export default function HomeScreen() {
  const [bgColor, setBgColor] = useState("#008080");
  const [email, setEmail] = useState("pritam");

  // const [errorLog, setErrorLog] = useState("ok");
  const changeColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    setBgColor(randomColor);
  };

  const login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const userEmail = userInfo.data?.user?.email ?? "";
      setEmail(userEmail);
      router.push({
        pathname: "/account",
        params: { email: email },
      });

    } catch (error) {
      console.error("Error login", error);
    }
  };

  const checkInternet = async () => {
    const state = await NetInfo.fetch();

    console.log("Connected:", state.isConnected);
    console.log("Internet reachable:", state.isInternetReachable);

    return state.isConnected && state.isInternetReachable;
  };

  useEffect(() => {
    const checkAndLogin = async () => {
      const online = await checkInternet();

      if (online) {
        login();
      } else {
        alert("❌ No internet");
      }
    };

    checkAndLogin();
  }, []);

  return (
    <>
      <Pressable style={{ flex: 1 }} onPress={changeColor}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, }}>
          <View style={styles.container}>
            <Text style={styles.heading}>
              Welcome!...
            </Text>

            <Text style={styles.heading}>
            </Text>
            <Pressable style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>
                Login
              </Text>
            </Pressable>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}

            />
            <Pressable style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>
                Offline
              </Text>
            </Pressable>

          </View>
        </View>
      </Pressable>



    </>
  );
}