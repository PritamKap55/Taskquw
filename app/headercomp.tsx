import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles";

export default function HeaderLayout() {
  const [hue, setHue] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [huechecke, setHuechecke] = useState(false);
  const bgColor = `hsl(${hue}, 100%, 27%)`;
  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem('myHue');

      console.log("Saved value:", savedValue);

      if (savedValue !== null) {
        const parsedHue = parseInt(savedValue, 10);
        setHue(parsedHue);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const saveHue = async (value: number) => {
    try {
      await AsyncStorage.setItem('myHue', value.toString());
      console.log("save saveHue");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadHue();
  }, []);

  useEffect(() => {
    console.log("Hue:", hue);
  }, [hue]);

  return (

    <>
      <View
        style={[
          styles.headerLayout,
          { backgroundColor: bgColor }
        ]}
      >
        <Text style={styles.title}>Account</Text>

        <TouchableOpacity
          style={styles.settings}
          onPress={() => setShowPopup(prev => !prev)}
        >
          <Text style={{ fontSize: 25 }}>⚙️</Text>
        </TouchableOpacity>
      </View>
      {showPopup && (
      <View style={{ position: "absolute", zIndex: 10, top: "9%", width: "100%", }}>

        <View style={styles.slidecontainer}>

          <View style={styles.container}>
            <LinearGradient
              colors={['red', 'yellow', 'lime', 'cyan', 'blue', 'magenta', 'red',]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rainbow} />

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={360}
              value={hue}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              onValueChange={(value) => setHue(Math.round(value))}
              onSlidingComplete={(value) => saveHue(Math.round(value))} />
          </View>
        </View>
        <CheckBox
          value={huechecke}
          onValueChange={setHuechecke}
          tintColors={{
            true: 'red',
            false: 'gray',
          }}
          style={{
            marginLeft: 'auto',
            transform: [{ scale: 1.7 }],
          }} />


      </View>)}
    </>
  );
}