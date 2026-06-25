import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {Pressable, Button, View , Text} from 'react-native';
import React, { useState } from 'react';
import { styles } from "../loginstyles";
import { router } from 'expo-router';
export default function HomeScreen() {
const [bgColor, setBgColor] = useState("#008080");

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
          access_token: userInfo.data?.idToken,
        },
      });

    } catch (error) {
      console.log(error);
    }
  };

return (
    <Pressable
    style={{ flex: 1 }}
    onPress={changeColor}
  >
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: bgColor,
    }}

  >
   <View style={styles.container}>
      <Text style={styles.heading}>
        Welcome!..
      </Text>

      <Pressable
        style={styles.button}
        onPress={login}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </Pressable>
    </View>
  </View>
  </Pressable>
);

}