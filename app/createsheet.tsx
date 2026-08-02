import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getThemeColors } from "./color";
import HeaderComp from "./headercomp";
import ListLayout from "./listlayout";
import { gradientLeafbtn, styles } from "./styles";
import TableLayout from "./tablelayout";
import TreeLayout from "./treelayout";

export default function createsheet() {

  const [hue, setHue] = useState(0);
  const { bgbodyColor, bgColor, gradientConfig, } = getThemeColors(hue);
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
  }, []);
  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />
      <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          <View style={styles.slide}>
            <View style={styles.card} pointerEvents="none">

              <ListLayout layout="List" />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card}>
              <ListLayout layout="List" />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card}>
              <TableLayout layout="New" />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card}>
              <TreeLayout layout="New" />
            </View>
          </View>
        </ScrollView>
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
