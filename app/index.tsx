import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from "./loginstyles";
export default function HomeScreen() {
  const [bgColor, setBgColor] = useState("#008080");
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
      console.log(userInfo);
      router.push({
        pathname: "/account",
        params: {
          access_token: userInfo.data?.idToken, headtext: "Account"
        },
      });

    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      console.log("Logged out");
    } catch (error) {
      console.log("logout Error", error);
    }
  };

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
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>
                Logout
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>



    </>
  );
}