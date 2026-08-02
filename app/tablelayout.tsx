import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getThemeColors } from "./color";
import { getAccessToken } from './googleAuth';
import HeaderComp from "./headercomp";
import { gradientLeafbtn, styles } from "./styles";

type LayoutProps = {
  layout: string;
};


export default function TableLayout({ layout }: LayoutProps) {
  const params = useLocalSearchParams();
  const [fileName, setFileName] = useState("");
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

      console.log("data", data)

      setItems(data?.values || []);

    } catch (error) {
      console.log("Get Sheet Error:", error);
    }
  };

  useEffect(() => {
    loadHue();

    if (params?.id) {
      getSheetData();

    }
    else {
      const data: (string | number)[][] = [
        ["id", "name", "age"],
        [1, "Pritam", 25],
        [2, "Kap", 28],
        [3, "Jane", 28],
      ];

      setItems(data);
    }
  }, []);
  return (
    <>

      {layout === undefined && (
        <HeaderComp hue={hue} setHue={setHue} />
      )}
      <View style={[{ height: layout === undefined ? "68%" : "100%", backgroundColor: bgbodyColor, },]} >

        {/* <ScrollView
          horizontal
          nestedScrollEnabled={true}
        > */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <ScrollView showsVerticalScrollIndicator={true}>

            <View style={styles.tableContainer}>

              {/* Header Row */}
              <View style={[styles.row, styles.headerRow]}>
                {items[0]?.map((header, i) => (
                  <Text key={i} style={styles.cell}>
                    {header}
                  </Text>
                ))}

                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/tablelayoutedit", params: { layout: "", id: params?.id, headtext: "Column Edit", selectedId: 1 }, })}
                >
                  <Text style={styles.icon}>➕✏️</Text>
                </TouchableOpacity>
              </View>

              {/* Data Rows */}
              {items.slice(1).map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
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
      {layout === undefined && (
        <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>
          {/* Add Row */}
          <TouchableOpacity

            onPress={() => router.push({ pathname: "/tablelayoutedit", params: { layout: "", id: params?.id, headtext: "Table Edit", selectedId: items.length + 1 }, })}
          >
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text style={styles.buttonText}>
                + Add New Row
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.inputBox}>
            <Text style={styles.inputlabel}>Name</Text>

            <TextInput
              placeholder="Enter File name"
              value={fileName}
              onChangeText={setFileName}
              style={styles.inputtext}
            />
          </View>
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
                <Text>Share</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
            // onPress={downloadCSV}
            >
              <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
                <Text> CSV</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </LinearGradient>
      )};

    </>

  );
}

