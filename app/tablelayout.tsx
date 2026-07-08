import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAccessToken } from './googleAuth';
import HeaderComp from "./headercomp";
import { gradientLeafbtn, styles } from "./styles";

export default function ListLayout() {
  const params = useLocalSearchParams();
  const [fileName, setFileName] = useState("");
  const [hue, setHue] = useState(0);
  const bgbodyColor = `hsl(${hue}, 100%, 95%)`;
  const bgF1Color = `hsl(${hue}, 100%, 94%)`;
  const bgF2Color = `hsl(${hue}, 100%, 75%)`;
  const bgF3Color = `hsl(${hue}, 100%, 27%)`;
  const [items, setItems] = useState<(string | number)[][]>([
    ["id", "name", "age"],
    [1, "Pritam", 25],
    [2, "Kap", 28],
    [3, "Jane", 28],
  ]);
  const gradientConfig: {
    colors: readonly [string, string, string];
    locations: readonly [number, number, number];
  } = {
    colors: [bgF1Color, bgF2Color, bgF3Color],
    locations: [0, 0.5, 1],
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
    if (params?.id) {
      getSheetData();

    }
  }, []);
  return (
    <>

      <HeaderComp hue={hue} setHue={setHue} />

      {/* Table */}
      <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>
        <ScrollView horizontal>
          <View style={styles.tableContainer}>

            {/* Header Row */}
            <View style={[styles.row, styles.headerRow]}>
              {items[0]?.map((header, i) => (
                <Text key={i} style={styles.cell}>
                  {header}
                </Text>
              ))}

              <TouchableOpacity
              // onPress={() => navigate("TableLayoutEdit", {access_token,files,selectedId: 1,})}
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

        {/* Add Row */}
        <TouchableOpacity
          style={styles.button}
        // onPress={() =>navigate("TableLayoutEdit", {access_token,files,selectedId: "0",})}
        >
          <Text style={styles.buttonText}>
            + Add New Row
          </Text>
        </TouchableOpacity>
      </View>

      <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>
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
          // onPress={downloadPDF}
          ><LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text> PDF</Text>
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


    </>

  );
}

