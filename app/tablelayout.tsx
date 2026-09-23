import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getThemeColors } from "./color";
import { tableData } from "./data";
import { getAccessToken } from './googleAuth';
import HeaderComp from "./headercomp";
import { styles } from "./styles";

type LayoutProps = {
  template: string;
};


export default function TableLayout({ template }: LayoutProps) {
  const params = useLocalSearchParams();
  const [fileName, setFileName] = useState("");
  const [hue, setHue] = useState(0);
  const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);
  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.error("Error loadHue", error);
    }
  };

  const [items, setItems] = useState<(string | number)[][]>([]);

  const [loading, setLoading] = useState(false);

  const dataToExport = {
    title: "Downloaded Document",
    date: new Date().toLocaleDateString(),
    items: ["Item A Data", "Item B Data", "Item C Data"]
  };



  const getSheetData = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      setItems(data?.values || []);

    } catch (error) {
      console.error("Error Get Sheet", error);
    }
  };

  useEffect(() => {
    loadHue();

    if (params?.id) {
      getSheetData();

    }
    else {


      setItems(tableData);
    }
  }, []);
  return (
    <>

      {template === undefined && (
        <HeaderComp hue={hue} setHue={setHue} />
      )}
      <View style={[{ height: template === undefined ? "68%" : "100%", backgroundColor: bgbodyColor, },]} >

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <ScrollView showsVerticalScrollIndicator={true}>

            <View style={styles.tableContainer}>

              <View style={[styles.row, { backgroundColor: oppositeColor }]}>
                {items[0]?.map((header, i) => (
                  <Text key={i} style={[styles.cell, { color: "#FFF" }]}>
                    {header}
                  </Text>
                ))}

                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/tablelayoutedit", params: { layout: "", id: params?.id, headtext: "Column Edit", selectedId: 1 }, })}
                >
                  <Text style={styles.icon}>➕✏️</Text>
                </TouchableOpacity>
              </View>


              {items.slice(1).map((row, rowIndex) => (
                <View key={rowIndex} style={[
                  styles.row,
                  {
                    backgroundColor:
                      rowIndex % 2 === 0 ? bgbodyColor : bgF4Color,
                  },
                ]}>
                  {items[0].map((_, colIndex) => (
                    <Text key={colIndex} style={styles.cell}>
                      {row[colIndex] || ""}
                    </Text>
                  ))}

                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      // onPress={() => navigate("TableLayoutEdit", {access_token,files,selectedId: rowIndex + 2,})}
                      onPress={() => router.push({ pathname: "/tablelayoutedit", params: { layout: "", id: params?.id, headtext: "Table Edit", selectedId: rowIndex + 2 }, })}
                    >
                      <Text style={styles.icon}>✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Text style={styles.icon}>❌</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>


      </View>
      {template === undefined && (
        <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>

          <TouchableOpacity
            onPress={() => router.push({ pathname: "/tablelayoutedit", params: { layout: "", id: params?.id, headtext: "Table Edit", selectedId: items.length + 1 }, })}
          >
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text style={styles.btnText}>
                + Add New Row
              </Text>
            </LinearGradient>
          </TouchableOpacity>
         
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >

            <TouchableOpacity
            // onPress={downloadPDF}
            >
              <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
                <Text style={styles.btnText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>

          
          </View>

        </LinearGradient>
      )}

    </>

  );
}

