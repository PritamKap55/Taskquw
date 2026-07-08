import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import HeaderComp from "./headercomp";
import ListLayout from "./listlayout";
import { gradientLeafbtn, styles } from "./styles";
import TableLayout from "./tablelayout";
import TreeLayout from "./treelayout";

export default function createsheet() {
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
  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />
      <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.slide}>
            <View style={styles.card}>
              <ListLayout />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card}>
              <ListLayout />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card}>
              <TableLayout />
            </View>
          </View>

          <View style={styles.slide}>
            <View style={styles.card}>
              <TreeLayout />
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
