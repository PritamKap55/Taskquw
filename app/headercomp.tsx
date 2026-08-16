import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles";

type HeaderProps = {
  hue: number;
  setHue: React.Dispatch<
    React.SetStateAction<number>
  >;
};

export default function HeaderComp({
  hue,
  setHue
}: HeaderProps) {

  const params = useLocalSearchParams();

  const [showPopup, setShowPopup] =
    useState(false);

  const [huechecke, setHuechecke] =
    useState(false);

  const bgColor =
    `hsl(${hue},100%,27%)`;
  const [showMenu, setShowMenu] = useState(false);
  const saveHue = async (value: number) => {
    try {
      await AsyncStorage.setItem('myHue', value.toString());
    } catch (error) {
      console.error("Error saveHue", error);
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      router.dismissAll();
    } catch (error) {
      console.error("Error logout", error);
    }
  };



  return (
    <>
      <View style={[styles.headerLayout, { backgroundColor: bgColor }]}>
        <TouchableOpacity style={styles.leftMenu} onPress={() => setShowMenu(prev => !prev)}>
          <Text style={{ fontSize: 25, color: 'white' }}>
            ︙
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {params?.headtext}
        </Text>

        <TouchableOpacity style={styles.settings} onPress={() => setShowPopup(prev => !prev)}>
          <Text style={{ fontSize: 25 }}>
            ⚙️
          </Text>
        </TouchableOpacity>
      </View>

      {showPopup && (
        <View style={{ position: "absolute", zIndex: 10, top: "9%", width: "100%" }}>
          <View style={styles.slidecontainer} >
            <View style={styles.container}>
              <LinearGradient colors={['red', 'yellow', 'lime', 'cyan', 'blue', 'magenta', 'red']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.rainbow}
              />

              <Slider
                style={styles.slider} minimumValue={0} maximumValue={360} value={hue}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                onValueChange={(value) => setHue(Math.round(value))}
                onSlidingComplete={(value) => saveHue(Math.round(value))}
              />
            </View>
          </View>


        </View>
      )}

      {/* Popup menu */}
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              router.push({
                pathname: "/appinfo",
                params: { headtext: "App Info" },
              });
            }}
          >
            <Text style={styles.menuText}>App Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              router.push({
                pathname: "/aboutus",
                params: { headtext: "About us" },
              });
            }}
          >
            <Text style={styles.menuText}>About us</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              logout();
            }}
          >
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}